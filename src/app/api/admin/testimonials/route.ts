import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import {
  getCMSTestimonials,
  saveCMSTestimonial,
  getCMSSettings,
  saveCMSSettings,
} from "@/lib/firebase/db";
import { testimonialInputSchema, settingsPatchSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    const { searchParams } = new URL(request.url);
    const customLimit = searchParams.get("limit");

    // Security: Unauthenticated requests ONLY receive published testimonials and NO internal settings
    const onlyPublished = !session || searchParams.get("published") === "true";
    const withSettings = session ? searchParams.get("settings") === "true" : false;

    const settings = await getCMSSettings();
    let limitCount: number | undefined;

    if (customLimit) {
      const parsed = parseInt(customLimit, 10);
      if (!isNaN(parsed) && parsed > 0) limitCount = parsed;
    } else if (onlyPublished && settings.testimonial_display_count && settings.testimonial_display_count > 0) {
      limitCount = settings.testimonial_display_count;
    }

    const testimonials = await getCMSTestimonials(onlyPublished, limitCount);

    if (withSettings) {
      return NextResponse.json({
        testimonials,
        settings,
      });
    }

    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("Fetch testimonials error:", err);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parseResult = testimonialInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const testimonial = await saveCMSTestimonial(parseResult.data);
    revalidatePath("/");

    return NextResponse.json({ success: true, testimonial });
  } catch (err) {
    console.error("Create testimonial error:", err);
    return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parseResult = settingsPatchSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const body = parseResult.data;
    let updatedSettings = null;

    if (typeof body.testimonial_display_count !== "undefined") {
      updatedSettings = await saveCMSSettings({
        testimonial_display_count: body.testimonial_display_count,
      });
    }

    if (Array.isArray(body.orders)) {
      for (const item of body.orders) {
        if (item.id) {
          await saveCMSTestimonial({ id: item.id, display_order: item.display_order });
        }
      }
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (err) {
    console.error("Patch settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
