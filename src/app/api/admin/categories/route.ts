import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import {
  getCMSCategories,
  saveCMSCategory,
  deleteCMSCategory,
  getCMSProjects,
} from "@/lib/firebase/db";
import { categoryInputSchema } from "@/lib/validation";

export async function GET() {
  try {
    const cats = await getCMSCategories();
    return NextResponse.json(cats);
  } catch (err) {
    console.error("Fetch categories error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parseResult = categoryInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const cat = await saveCMSCategory(parseResult.data);
    revalidatePath("/works");
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true, category: cat });
  } catch (err) {
    console.error("Save category error:", err);
    return NextResponse.json({ error: "Failed to save category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Category ID required" }, { status: 400 });
    }

    // Security & Integrity: Protect against deleting categories referenced by projects
    const categories = await getCMSCategories();
    const targetCat = categories.find((c) => c.id === id || c.slug === id);
    const targetSlug = targetCat?.slug || id;

    const allProjects = await getCMSProjects();
    const referencingProjects = allProjects.filter(
      (p) => p.category === id || p.category_slug === id || p.category === targetSlug || p.category_slug === targetSlug
    );

    if (referencingProjects.length > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${id}" because it is currently assigned to ${referencingProjects.length} project(s). Reassign these projects before deleting the category.`,
          referencingCount: referencingProjects.length,
        },
        { status: 409 }
      );
    }

    await deleteCMSCategory(id);
    revalidatePath("/works");
    revalidatePath("/portfolio");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete category error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
