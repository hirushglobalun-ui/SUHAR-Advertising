import { cookies } from "next/headers";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "suhar_admin_session";
const SESSION_DURATION_HOURS = 24;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "CRITICAL SECURITY WARNING: ADMIN_SESSION_SECRET is not set in production. Set a strong random secret."
      );
    }
    return "suhar_default_fallback_session_secret_change_immediately";
  }
  return secret;
}

export interface AdminSession {
  email: string;
  expiresAt: number;
}

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function signToken(data: object): string {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expectedSig = crypto
      .createHmac("sha256", getSessionSecret())
      .update(payload)
      .digest("base64url");

    if (!safeEqual(signature, expectedSig)) return null;

    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (Date.now() > session.expiresAt) return null;

    return session;
  } catch {
    return null;
  }
}

export async function createAdminSession(email: string) {
  const expiresAt = Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000;
  const token = signToken({ email, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_HOURS * 60 * 60,
  });

  return { email, expiresAt };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

/**
 * Validates admin credentials using constant-time comparisons.
 * Uses ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
 */
export function validateAdminCredentials(email: string, pass: string): boolean {
  const normalizedEmail = email.trim().toLowerCase();

  const configuredEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const allowedEmails = new Set<string>();

  if (configuredEmail) {
    allowedEmails.add(configuredEmail);
  }
  // Standard fallback emails for initial administration
  allowedEmails.add("admin@suhar.com");
  allowedEmails.add("admin@gmail.com");

  if (!allowedEmails.has(normalizedEmail)) {
    return false;
  }

  const validPass = process.env.ADMIN_PASSWORD || "admin123";
  return safeEqual(pass, validPass);
}

/**
 * Validate origin for mutation requests to mitigate CSRF attacks
 */
export function validateCsrfOrigin(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    // Direct or server-to-server request
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    return originHost === host;
  } catch {
    return false;
  }
}

// In-Memory Login Brute-Force Rate Limiter (per instance)
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  failures: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

export function checkLoginRateLimit(identifier: string): { allowed: boolean; remainingSeconds?: number } {
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  // Lockout expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(identifier: string) {
  const record = loginAttempts.get(identifier) || { failures: 0, lockedUntil: 0 };
  record.failures += 1;

  if (record.failures >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }

  loginAttempts.set(identifier, record);
}

export function recordSuccessfulLogin(identifier: string) {
  loginAttempts.delete(identifier);
}
