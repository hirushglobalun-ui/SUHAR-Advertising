import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getCMSProjects, saveCMSProject } from "@/lib/firebase/db";
import { projectCreateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    // Security: Unauthenticated public requests can ONLY view published projects
    const onlyPublished = !session || searchParams.get("published") === "true";

    // Public frontend requests (no session, or explicit ?published=true) sort newest-first
    // so newly created published projects appear at the top of Recent Projects automatically.
    // Admin panel authenticated requests keep display_order ASC for manual ordering control.
    const sortBy: "newest" | "display_order" =
      (!session || searchParams.get("published") === "true") ? "newest" : "display_order";

    const projects = await getCMSProjects({ categorySlug: category, onlyPublished, sortBy });
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Fetch projects error:", err);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parseResult = projectCreateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const project = await saveCMSProject(parseResult.data);

    revalidatePath("/works");
    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/works/${project.slug}`);

    return NextResponse.json({ success: true, project });
  } catch (err) {
    console.error("Create project error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
