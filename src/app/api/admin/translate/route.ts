import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { translateEnglishToArabic, translateBatchEnglishToArabic } from "@/lib/translate";
import { translateInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const parseResult = translateInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { text, texts } = parseResult.data;

    if (text) {
      const translated = await translateEnglishToArabic(text);
      return NextResponse.json({ success: true, translated });
    }

    if (texts) {
      const translated = await translateBatchEnglishToArabic(texts);
      return NextResponse.json({ success: true, translated });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed" },
      { status: 500 }
    );
  }
}
