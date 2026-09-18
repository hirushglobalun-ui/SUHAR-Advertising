import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { saveCMSTestimonial, deleteCMSTestimonial } from "@/lib/firebase/db";
import { testimonialInputSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await params;
    const rawBody = await request.json();
    const parseResult = testimonialInputSchema.partial().safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const updated = await saveCMSTestimonial({ ...parseResult.data, id });
    revalidatePath("/");

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (err) {
    console.error("Update testimonial error:", err);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { id } = await params;
    await deleteCMSTestimonial(id);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete testimonial error:", err);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
