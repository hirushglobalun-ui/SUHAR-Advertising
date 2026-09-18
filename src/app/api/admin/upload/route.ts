import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

/**
 * Validate binary magic bytes to ensure file is genuinely an authentic raster image.
 * Excludes SVG to completely eliminate Stored XSS vectors from active XML content.
 */
function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; mimeType: string | null } {
  if (buffer.length < 12) {
    return { isValid: false, mimeType: null };
  }

  // JPEG (SOI): FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, mimeType: "image/jpeg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, mimeType: "image/png" };
  }

  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { isValid: true, mimeType: "image/webp" };
  }

  // GIF: GIF87a or GIF89a
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { isValid: true, mimeType: "image/gif" };
  }

  return { isValid: false, mimeType: null };
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit size: up to 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 15MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Deep inspection: verify file magic bytes
    const verification = validateImageMagicBytes(buffer);
    if (!verification.isValid) {
      return NextResponse.json(
        {
          error: "Invalid file content. Only authentic raster images (PNG, JPEG, WebP, GIF) are permitted. SVG is disabled for security.",
        },
        { status: 400 }
      );
    }

    // 1. If Cloudinary is configured, upload to Cloudinary CDN
    if (isCloudinaryConfigured()) {
      try {
        const result = await uploadToCloudinary(buffer, "suhar_advertising");
        return NextResponse.json({
          success: true,
          url: result.url,
          provider: "cloudinary",
          bytes: result.bytes,
        });
      } catch (cloudErr) {
        console.error("Cloudinary upload failed, falling back to local:", cloudErr);
      }
    }

    // 2. Fallback to local storage in public/uploads if Cloudinary is not yet configured
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const rawExt = path.extname(file.name).toLowerCase();
    const safeExt = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(rawExt)
      ? rawExt
      : verification.mimeType === "image/png"
      ? ".png"
      : verification.mimeType === "image/webp"
      ? ".webp"
      : ".jpg";

    const cleanBase = path
      .basename(file.name, rawExt)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);

    const uniqueFilename = `${cleanBase || "asset"}-${Date.now()}${safeExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueFilename,
      provider: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
