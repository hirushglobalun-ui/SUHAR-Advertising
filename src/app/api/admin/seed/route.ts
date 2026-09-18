import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { seedFirestoreWithInitialData } from "@/lib/firebase/db";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
  }

  // Security: Prevent accidental data overwrites in production
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_SEED_ENDPOINT !== "true") {
    return NextResponse.json(
      {
        error:
          "Database seeding is disabled in production to prevent accidental data overwrites. Set ENABLE_SEED_ENDPOINT=true in environment variables if manual synchronization is explicitly required.",
      },
      { status: 403 }
    );
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { error: "Firebase is not configured in environment variables." },
      { status: 400 }
    );
  }

  try {
    const result = await seedFirestoreWithInitialData();
    return NextResponse.json({
      success: true,
      message: "Successfully seeded initial data to Firestore",
      counts: result.counts,
    });
  } catch (err: unknown) {
    console.error("Seeding error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to seed Firestore" },
      { status: 500 }
    );
  }
}
