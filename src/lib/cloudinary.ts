import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Lazy configure Cloudinary
function getCloudinaryInstance() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

/**
 * Upload an image buffer directly to Cloudinary with automatic optimization.
 * Converts to WebP format, applies smart auto-quality compression.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "suhar_advertising"
): Promise<{ url: string; public_id: string; bytes: number }> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured in environment variables.");
  }

  const client = getCloudinaryInstance();

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format: "webp",
        transformation: [
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload image to Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
