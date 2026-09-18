import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  FolderTree,
  MessageSquare,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getCMSProjects,
  getCMSCategories,
  getCMSTestimonials,
  getCMSClients,
} from "@/lib/firebase/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, categories, testimonials, clients] = await Promise.all([
    getCMSProjects(),
    getCMSCategories(),
    getCMSTestimonials(),
    getCMSClients(),
  ]);

  const publishedProjects = projects.filter((p) => p.is_published).length;

  const stats = [
    {
      label: "Total Works",
      value: projects.length,
      sub: `${publishedProjects} published`,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/works",
    },
    {
      label: "Categories",
      value: categories.length,
      sub: "Active classifications",
      icon: FolderTree,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/categories",
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      sub: "Client reviews",
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/testimonials",
    },
    {
      label: "Client Logos",
      value: clients.length,
      sub: "Partner brands",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/admin/clients",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
            Welcome to SUHAR CMS
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Control your live website works, client reviews, and brand logos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/works/new"
            className="inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#e05807]"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-md"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-3xl font-extrabold text-slate-900">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-slate-500">{s.sub}</div>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Quick Content Actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/works/new"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange"
          >
            <Plus className="h-3.5 w-3.5 text-orange" />
            Add New Project
          </Link>
          <Link
            href="/admin/testimonials"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange"
          >
            <Plus className="h-3.5 w-3.5 text-orange" />
            Add Testimonial
          </Link>
          <Link
            href="/admin/clients"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange"
          >
            <Plus className="h-3.5 w-3.5 text-orange" />
            Add Client Logo
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange"
          >
            <FolderTree className="h-3.5 w-3.5 text-orange" />
            Manage Categories
          </Link>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Recent Projects & Works
            </h2>
            <p className="text-xs text-slate-500">
              Listing your latest verified portfolio works
            </p>
          </div>
          <Link
            href="/admin/works"
            className="text-xs font-bold text-orange hover:underline"
          >
            View All ({projects.length})
          </Link>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.cover_image}
                        alt={project.title_en}
                        className="h-10 w-14 rounded-lg object-cover bg-slate-100"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{project.title_en}</div>
                        <div className="text-xs text-slate-400 rtl:text-right">{project.title_ar}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {project.category_slug}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-slate-600">
                    {project.client_en}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        project.is_published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          project.is_published ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/admin/works/${project.id}/edit`}
                      className="text-xs font-bold text-orange hover:text-[#d45307]"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
