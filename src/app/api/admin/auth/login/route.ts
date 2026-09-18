import { NextResponse } from "next/server";
import {
  validateAdminCredentials,
  createAdminSession,
  validateCsrfOrigin,
  checkLoginRateLimit,
  recordFailedLogin,
  recordSuccessfulLogin,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    // 1. Validate request origin
    if (!validateCsrfOrigin(request)) {
      return NextResponse.json(
        { error: "Forbidden cross-origin request." },
        { status: 403 }
      );
    }

    // 2. Identify client for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown_ip";

    const rateLimit = checkLoginRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${rateLimit.remainingSeconds || 900} seconds.`,
        },
        { status: 429 }
      );
    }

    // 3. Parse and validate input
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // 4. Verify credentials
    if (!validateAdminCredentials(email, password)) {
      recordFailedLogin(ip);
      return NextResponse.json(
        { error: "Invalid admin email or password." },
        { status: 401 }
      );
    }

    // 5. Successful login
    recordSuccessfulLogin(ip);
    const session = await createAdminSession(email);
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
