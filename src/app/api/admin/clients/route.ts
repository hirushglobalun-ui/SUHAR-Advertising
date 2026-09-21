import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/auth/session";
import { getCMSClients, saveCMSClient } from "@/lib/firebase/db";
import { clientLogoInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const session = await getAdminSession();
    const { searchParams } = new URL(request.url);

    // Security: Unauthenticated public requests can ONLY view active client logos
    const onlyActive = !session || searchParams.get("active") === "true";

    const clients = await getCMSClients(onlyActive);
    return NextResponse.json(clients, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (err) {
    console.error("Fetch clients error:", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    const rawBody = await request.json();
    const parseResult = clientLogoInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const client = await saveCMSClient(parseResult.data);
    revalidatePath("/");

    return NextResponse.json({ success: true, client });
  } catch (err) {
    console.error("Create client error:", err);
    return NextResponse.json({ error: "Failed to save client" }, { status: 500 });
  }
}
