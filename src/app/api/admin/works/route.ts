import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getCMSProjects, saveCMSProject } from "@/lib/firebase/db";
import { projectInputSchema } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    // Security: Unauthenticated public requests can ONLY view published projects
    const onlyPublished = !session || searchParams.get("published") === "true";

    const projects = await getCMSProjects({ categorySlug: category, onlyPublished });
    return NextResponse.json(projects);
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
    const parseResult = projectInputSchema.safeParse(rawBody);

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
