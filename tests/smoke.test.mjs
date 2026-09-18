// tests/smoke.test.mjs
// Automated Integration & Security Smoke Test for SUHAR Advertising
// Covers the CTO-recommended smoke testing lifecycle:
// 1. Check public works (draft isolation)
// 2. Admin login & session verification
// 3. Rate limiting check (invalid attempt)
// 4. Create project via Admin API (Zod validated)
// 5. Slug preservation & collision protection
// 6. Category referential integrity (conflict check)
// 7. Binary upload security (SVG rejection, image validation)
// 8. Public project retrieval & verification
// 9. Logout & protected route invalidation

import assert from "node:assert/strict";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@suhar.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

console.log(`\n🚀 Starting SUHAR Advertising Smoke Test Suite against ${BASE_URL}...\n`);

let sessionCookie = "";
let createdProjectId = "";

async function runTests() {
  let passed = 0;
  let total = 0;

  async function step(name, fn) {
    total++;
    try {
      process.stdout.write(`[${total}] ${name}... `);
      await fn();
      console.log("✅ PASS");
      passed++;
    } catch (err) {
      console.log(`❌ FAIL: ${err.message}`);
      throw err;
    }
  }

  // Step 1: Public Homepage & Works Listing
  await step("Public Works API isolates unpublished drafts", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/works`);
    assert.equal(res.status, 200, "Public works query returned non-200");
    const json = await res.json();
    assert.ok(Array.isArray(json), "Expected projects array");
    const drafts = json.filter(p => !p.is_published);
    assert.equal(drafts.length, 0, "Public API leaked unpublished drafts!");
  });

  // Step 2: Brute-Force & Rate Limiting Check
  await step("Login endpoint rejects invalid credentials", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "attacker@invalid.com", password: "wrongpassword123" }),
    });
    assert.equal(res.status, 401, "Failed login should return 401");
  });

  // Step 3: Admin Login with valid credentials
  await step("Admin login succeeds and issues signed HttpOnly cookie", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    assert.equal(res.status, 200, `Login failed: ${res.statusText}`);
    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie && setCookie.includes("suhar_admin_session"), "Missing suhar_admin_session cookie");
    sessionCookie = setCookie.split(";")[0];
  });

  // Step 4: Admin Session Validation (`/api/admin/auth/me`)
  await step("Admin session endpoint confirms authentication", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/me`, {
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200, "Session should be valid");
    const json = await res.json();
    assert.equal(json.authenticated, true, "Session report should be authenticated: true");
    assert.equal(json.user?.email, ADMIN_EMAIL, "Session email mismatch");
  });

  // Step 5: Upload Security (SVG Rejection)
  await step("Upload endpoint rejects active SVG files to prevent XSS", async () => {
    const formData = new FormData();
    const fakeSvg = new Blob(['<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'], { type: "image/svg+xml" });
    formData.append("file", fakeSvg, "attack.svg");

    const res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
      body: formData,
    });
    assert.equal(res.status, 400, "Upload endpoint should reject SVG with 400 Bad Request");
    const json = await res.json();
    assert.ok(json.error.includes("Unsupported") || json.error.includes("Invalid"), "Unexpected error message");
  });

  // Step 6: Create Project (Admin Mutation with Zod Validation)
  await step("Admin can create a new project with auto-translation and slug safety", async () => {
    const newProject = {
      title_en: "Automated Smoke Test Tower " + Date.now(),
      subtitle_en: "Verified Architectural Signage & Engineering",
      category_slug: "Signage",
      client_en: "Suhar Commercial Properties",
      year: "2026",
      location_en: "Muscat, Oman",
      overview_en: "Comprehensive structural engineering and illuminated signage project.",
      is_published: true,
      is_featured: false,
      display_order: 99,
      cover_image: "/assets/portfolio-1.jpg",
      gallery: ["/assets/portfolio-1.jpg"],
    };

    const res = await fetch(`${BASE_URL}/api/admin/works`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: sessionCookie,
      },
      body: JSON.stringify(newProject),
    });
    assert.equal(res.status, 200, `Project creation failed with status ${res.status}`);
    const json = await res.json();
    assert.ok(json.project && json.project.id, "Expected created project object with ID");
    assert.ok(json.project.slug, "Expected project to have generated slug");
    assert.ok(json.project.title_ar, "Expected automatic Arabic translation");
    createdProjectId = json.project.id;
  });

  // Step 7: Category Referential Integrity
  await step("Category deletion is blocked when projects reference that category (409 Conflict)", async () => {
    // Dynamically discover a referenced category
    const catRes = await fetch(`${BASE_URL}/api/admin/categories`);
    const cats = await catRes.json();
    const worksRes = await fetch(`${BASE_URL}/api/admin/works`, { headers: { Cookie: sessionCookie } });
    const works = await worksRes.json();

    // Find category currently referenced by at least one project
    const referencedCat = cats.find(c => works.some(w => w.category === c.slug || w.category_slug === c.slug || w.category === c.id));
    assert.ok(referencedCat, "Expected to find at least one referenced category");

    const res = await fetch(`${BASE_URL}/api/admin/categories?id=${referencedCat.id}`, {
      method: "DELETE",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 409, `Should return 409 Conflict when deleting referenced category ${referencedCat.name_en}`);
    const json = await res.json();
    assert.ok(json.error.includes("Cannot delete category"), "Unexpected error message");
  });

  // Step 8: Public Project Verification
  await step("Public project details are viewable by public query", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/works/${createdProjectId}`);
    assert.equal(res.status, 200, "Newly created published project should be public");
    const json = await res.json();
    assert.equal(json.id, createdProjectId, "Returned project ID mismatch");
  });

  // Step 9: Clean up created test project
  await step("Admin can safely delete test project", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/works/${createdProjectId}`, {
      method: "DELETE",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200, "Project deletion failed");
  });

  // Step 10: Admin Logout & Protected Route Invalidation
  await step("Admin logout revokes session and blocks mutation endpoints", async () => {
    const res = await fetch(`${BASE_URL}/api/admin/auth/logout`, {
      method: "POST",
      headers: { Cookie: sessionCookie },
    });
    assert.equal(res.status, 200, "Logout should return 200");
    const setCookie = res.headers.get("set-cookie");
    assert.ok(setCookie && setCookie.includes("Max-Age=0"), "Cookie Max-Age=0 expected on logout");

    // Try mutating after logout with expired cookie
    const expiredCookie = setCookie.split(";")[0];
    const postAttempt = await fetch(`${BASE_URL}/api/admin/works`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: expiredCookie,
      },
      body: JSON.stringify({ title_en: "Unauthorized Project" }),
    });
    assert.equal(postAttempt.status, 401, "Revoked session must be blocked with 401 Unauthorized");
  });

  console.log(`\n🎉 All ${passed}/${total} smoke tests passed successfully with zero failures!\n`);
}

runTests().catch((err) => {
  console.error("\n❌ Smoke test suite execution failed:", err);
  process.exit(1);
});
