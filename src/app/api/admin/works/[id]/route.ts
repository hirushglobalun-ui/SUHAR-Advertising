import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getCMSProjectById, saveCMSProject, deleteCMSProject } from "@/lib/firebase/db";
import { projectCreateSchema, projectUpdateSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    const { id } = await params;

    const project = await getCMSProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Security: Unauthenticated requests cannot inspect unpublished drafts
    if (!session && !project.is_published) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("Fetch project error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

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
    const existing = await getCMSProjectById(id);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const rawBody = await request.json();
    const parseResult = projectUpdateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const updated = await saveCMSProject({ ...parseResult.data, id });

    revalidatePath("/works");
    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/works/${updated.slug}`);
    if (existing.slug && existing.slug !== updated.slug) {
      revalidatePath(`/works/${existing.slug}`);
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
    const existing = await getCMSProjectById(id);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await deleteCMSProject(id);

    revalidatePath("/works");
    revalidatePath("/portfolio");
    revalidatePath("/");
    if (existing.slug) {
      revalidatePath(`/works/${existing.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
