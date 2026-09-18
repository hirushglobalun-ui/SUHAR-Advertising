"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Users,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If on login page, render children directly without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/works", label: "Works & Projects", icon: Briefcase },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
    { href: "/admin/clients", label: "Client Logos", icon: Users },
  ];

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800">
      {/* Sidebar Desktop - Pinned to Viewport Height */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-[#062D4F] p-5 text-white lg:flex">
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <img
              src="/logo/Suharlogo.webp"
              alt="SUHAR Admin"
              className="h-9 w-auto object-contain brightness-0 invert"
            />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-orange">CMS Console</div>
              <div className="text-[10px] text-white/60">Firebase Edition</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-orange text-white shadow-sm shadow-orange/20"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions - Always Visible */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/10 px-3.5 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-orange" />
              Live Public Site
            </span>
          </Link>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 rounded-xl bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SUHAR CMS Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-orange hover:text-orange"
            >
              <span>View Public Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3 sm:pl-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#062D4F] text-xs font-bold text-white">
                SA
              </div>
              <div className="hidden text-left md:block">
                <div className="text-xs font-bold text-slate-800">Administrator</div>
                <div className="text-[10px] text-slate-400">admin@suhar.com</div>
              </div>
            </div>

            {/* Quick Logout Button in Header */}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:border-rose-300 transition-colors cursor-pointer"
              title="Sign out of CMS"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isLoggingOut ? "..." : "Sign Out"}</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="h-full w-64 bg-[#062D4F] p-5 text-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-display font-bold text-white">SUHAR Admin</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-white/70" />
                </button>
              </div>
              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
