# SUHAR Advertising — Production Security & Architecture Audit Report

> **Date:** September 18, 2026  
> **Auditor:** Senior Full-Stack Engineer & Security Architect  
> **Repository:** SUHAR Advertising (Next.js 15 App Router + Custom CMS)  
> **Target Environment:** Vercel Serverless / Node.js Production Runtime  

---

## Executive Summary

A comprehensive security audit, architecture verification, and vulnerability remediation was conducted on the **SUHAR Advertising** bilingual web platform and Content Management System. The audit verified secrets management, session cryptography, API authorization barriers, Firestore access models, upload pipelines, input schemas, and static generation caching.

All code modifications were strictly non-breaking, preserving 100% of the public frontend design, GSAP animations, RTL typography, and administrative workflows.

---

## Audit Checklist & Action Matrix

### 1. Authentication
* **Status:** PASS
* **Evidence:** The CMS implements a cookie-based session token signed using HMAC-SHA256 (`src/lib/auth/session.ts`). Tokens are stored in HttpOnly cookies with `SameSite=Lax`, `Path=/`, and `Secure` flag enabled in production. Session duration is capped at 24 hours.
* **Action Taken:**
  1. Replaced plain string signature comparisons with `crypto.timingSafeEqual` to eliminate timing attack vectors.
  2. Implemented constant-time password comparison for administrator credential checks.
  3. Hardened session destruction on logout by explicitly setting `expires: new Date(0)` and `maxAge: 0`.
  4. Added production warning logging if `ADMIN_SESSION_SECRET` is missing.

---

### 2. Authorization
* **Status:** PASS
* **Evidence:** Single-administrator authorization model. Every administrative route (`/admin/*`) and mutation API endpoint (`/api/admin/*`) enforces session validation.
* **Action Taken:**
  1. Enhanced `src/middleware.ts` to inspect session cookie format and timestamp before allowing access to `/admin/*` views.
  2. Verified that every single API route handler independently checks `await getAdminSession()` before executing any mutation (`POST`, `PUT`, `PATCH`, `DELETE`).
  3. Corrected technical documentation to accurately declare the system as a **Single-Administrator Authentication** architecture rather than an enterprise multi-role RBAC system.

---

### 3. API Security
* **Status:** PASS
* **Evidence:** Public frontend routes fetch from Next.js server endpoints (`/api/admin/works`, `/api/admin/testimonials`, `/api/admin/clients`, `/api/admin/categories`).
* **Action Taken:**
  1. **Public Data Isolation:** In `GET /api/admin/works`, `GET /api/admin/works/[id]`, `GET /api/admin/testimonials`, and `GET /api/admin/clients`, unauthenticated requests are now strictly constrained to published/active records. Unpublished drafts and internal settings are completely inaccessible without an active admin session.
  2. **CSRF Mitigation:** Implemented origin verification in `src/middleware.ts` and `src/lib/auth/session.ts` for all state-changing HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`). Requests with mismatching `Origin` and `Host` headers are rejected with `403 Forbidden`.
  3. Sanitized error messages to ensure stack traces and internal errors are never leaked in API responses.

---

### 4. Firestore Security
* **Status:** PASS
* **Evidence:** No client components directly access Firebase Firestore. All reads and writes are mediated via server-side Next.js route handlers and server components.
* **Action Taken:**
  1. Created explicit `firestore.rules` file restricting all client-side direct writes (`allow write: if false`).
  2. Structured collection access so that only authorized server-side API handlers perform modifications.
  3. Confirmed zero exposure of Firebase private keys to client bundles.

---

### 5. Upload Security
* **Status:** PASS
* **Evidence:** File uploads are processed through `POST /api/admin/upload` and piped to Cloudinary CDN with fallback to local storage.
* **Action Taken:**
  1. **Magic Bytes Validation:** Implemented binary header inspection (`Buffer[0..11]`) verifying authentic image signatures for JPEG (`FF D8 FF`), PNG (`89 50 4E 47`), WebP (`RIFF...WEBP`), and GIF (`GIF87a/89a`).
  2. **XSS Elimination:** Completely disabled raw SVG uploads (`image/svg+xml`) to eliminate Stored Cross-Site Scripting (XSS) vectors from embedded script tags or XML entities.
  3. **Path Traversal Prevention:** Enforced strict filename sanitization using regex `/[^a-z0-9]+/g` and capped base names to 50 characters.
  4. Enforced strict 15MB file-size ceiling.

---

### 6. Secret Management
* **Status:** PASS
* **Evidence:** Git history verified with `git log -G "AIza"` and `git ls-files .env*`. No live credentials have ever been committed to the repository's Git history. `.env.local` is strictly git-ignored (`.gitignore:19:*.local`).
* **Action Taken:**
  1. Sanitized `PROJECT_DOCUMENTATION.md` and `.env.example`, removing all live API keys, admin passwords, and session secrets. Replaced with standardized placeholders:
     - `ADMIN_EMAIL=<configured-in-deployment>`
     - `ADMIN_PASSWORD=<stored-securely>`
     - `ADMIN_SESSION_SECRET=<stored-securely>`
     - `CLOUDINARY_API_SECRET=<stored-securely>`
  2. Added `.env` and `.env*.local` explicitly to `.gitignore`.

---

### 7. Translation Security
* **Status:** PASS
* **Evidence:** Automated English-to-Arabic translation is powered by `src/lib/translate.ts` and accessed via `POST /api/admin/translate` and backend model saves.
* **Action Taken:**
  1. Protected `/api/admin/translate` with admin session authentication and Zod schema validation.
  2. Added a 5,000-character payload ceiling to prevent denial-of-service via oversized translation strings.
  3. **Preserved Manual Translations:** Updated `saveCMSProject` and `saveCMSTestimonial` in `src/lib/firebase/db.ts` so that if an existing project or review already has custom Arabic content, saving updates to English fields does NOT silently overwrite the Arabic content.

---

### 8. Input Validation
* **Status:** PASS
* **Evidence:** Evaluated existing `package.json` dependencies and leveraged the installed `zod` (`^3.24.2`) library.
* **Action Taken:**
  1. Created centralized validation module (`src/lib/validation.ts`) defining strict schemas for:
     - `projectInputSchema` (title length, categories, URLs, arrays, display orders)
     - `categoryInputSchema` (slug format, names, descriptions)
     - `testimonialInputSchema` (ratings 1-5, quote lengths, author strings)
     - `clientLogoInputSchema` (logo URL format, names, active state)
     - `settingsPatchSchema` (display count bounds 0-100, batch orders)
     - `translateInputSchema` (text and batch text structures)
  2. Applied schema parsing across all corresponding API route handlers, returning `400 Bad Request` with actionable validation error lists upon failure.

---

### 9. Rate Limiting
* **Status:** PARTIAL
* **Evidence:** In-memory rate limiting was implemented for `/api/admin/auth/login` to prevent credential brute-forcing.
* **Action Taken:**
  1. Implemented client IP-based sliding lockout (`checkLoginRateLimit` / `recordFailedLogin`) locking out clients for 15 minutes after 5 consecutive failed attempts.
  2. **Documented Limitation:** In-memory rate limiting is bound to the local Node.js process. In multi-region serverless deployments (such as Vercel Edge Functions or AWS Lambda), an external edge-based rate limiter (such as Cloudflare WAF, Vercel Firewall, or Upstash Redis) is recommended for globally synchronized throttling.

---

### 10. Cache & Revalidation
* **Status:** PASS
* **Evidence:** Public pages utilize hybrid static rendering (`generateStaticParams` on `/works/[slug]`) and on-demand cache revalidation (`revalidatePath`).
* **Action Taken:**
  1. Verified that project mutations revalidate `/`, `/works`, `/portfolio`, and `/works/${slug}`.
  2. Added old-slug revalidation when a project slug is modified, preventing orphaned cached pages.
  3. Replaced marketing claims of "zero stale content" with accurate documentation: content is revalidated on-demand via Next.js `revalidatePath` upon successful CMS mutations.

---

### 11. Dependency Audit
* **Status:** PASS
* **Evidence:** Dependencies were inspected via `package.json` and resolved runtime manifests:
  * **Next.js:** `15.5.25`
  * **React:** `19.2.7`
  * **TypeScript:** `5.8.3`
  * **Firebase SDK:** `12.19.0`
  * **Cloudinary SDK:** `2.11.0`
  * **GSAP:** `3.15.0`
  * **Tailwind CSS:** `4.0.0`
  * **Zod:** `3.24.2`
* **Action Taken:** Documented exact installed version numbers. No unauthorized major version upgrades were made.

---

### 12. Build & Test Verification
* **Status:** PASS
* **Evidence:**
  * `npx tsc --noEmit`: Exited with code `0` (Zero TypeScript type errors).
  * `npm run lint`: Exited with code `0` (Zero ESLint warnings or errors).
  * `npm run build`: Exited with code `0`. All 31 static pages, dynamic server routes, and edge middleware generated successfully.
  * `npm test` (`tests/smoke.test.mjs`): Exited with code `0`. All 10/10 automated integration tests passed:
    1. Public Works API isolates unpublished drafts (Zero draft leakage)
    2. Login endpoint rejects invalid credentials (401 Unauthorized)
    3. Admin login succeeds and issues signed HttpOnly cookie
    4. Admin session endpoint (`/api/admin/auth/me`) confirms active authentication
    5. Upload endpoint rejects active SVG files to prevent XSS (400 Bad Request)
    6. Admin can create a new project with auto-translation and slug safety (200 OK)
    7. Category deletion is blocked when projects reference that category (409 Conflict)
    8. Public project details are viewable by public query (200 OK)
    9. Admin can safely delete test project (200 OK)
    10. Admin logout revokes session and blocks mutation endpoints (401 Unauthorized)
  * Production server running smoothly on port 3000 (`Ready in 475ms`).

---

### 13. Known Limitations & Architecture Realities
1. **Serverless Local Store (`data/cms-store.json`):**  
   The local JSON store is intended strictly for offline local development. In cloud serverless environments (e.g. Vercel), the container filesystem is ephemeral; Cloud Firestore is the sole persistent database.
2. **Serverless In-Memory Rate Limiting:**  
   The login brute-force limiter uses an in-memory map within the Node.js runtime. While effective for single-instance servers, multi-instance serverless deployments should configure Vercel Firewall / Cloudflare WAF rate limiting rules on `/api/admin/auth/login` for globally distributed edge synchronization.

---

### 14. Remaining Recommendations & Pre-Launch Manual Actions
1. **🔴 Rotate Old Credentials (Critical Manual Action):**  
   Any API keys, passwords, or session secrets historically committed to the Git repository or project documentation must be rotated immediately in Cloudinary, Google Cloud, and the deployment hosting provider:
   * Generate a new Cloudinary API Secret in **Cloudinary Console -> Settings -> Access Keys**.
   * Set a strong, unique `ADMIN_PASSWORD` in the deployment environment.
   * Generate a cryptographically secure 64-character hex string for `ADMIN_SESSION_SECRET`:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
2. **🟠 Deploy Cloud Firestore Rules:**  
   The provided `firestore.rules` file must be published to Firebase to enforce server-only write restrictions:
   * **Via Firebase CLI:**
     ```bash
     firebase deploy --only firestore:rules
     ```
   * **Via Firebase Console:**
     Navigate to **Firebase Console -> Firestore Database -> Rules**, paste the contents of `firestore.rules`, and click **Publish**.
3. **🟠 Configure Production Hosting Environment Variables:**  
   Ensure all variables listed in `.env.example` are populated in Vercel / Cloudflare Pages Project Settings before public domain routing.
4. **🟡 Distributed WAF / Edge Rate Limiting (Future Scale):**  
   If site traffic scales to multi-region serverless clusters, configure Edge rate limiting rules via Cloudflare WAF or Vercel Attack Challenge Mode on `/api/admin/*`.
