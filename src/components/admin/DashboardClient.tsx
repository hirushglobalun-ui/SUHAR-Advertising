"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  FolderTree,
  MessageSquare,
  Plus,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import type { CMSProject } from "@/types/cms";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectTimestamp } from "@/lib/utils";

interface DashboardClientProps {
  initialProjects: CMSProject[];
  categoriesCount: number;
  testimonialsCount: number;
  clientsCount: number;
}

export default function DashboardClient({
  initialProjects,
  categoriesCount,
  testimonialsCount,
  clientsCount,
}: DashboardClientProps) {
  const [projects, setProjects] = useState<CMSProject[]>(initialProjects);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] =
    useState<CMSProject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const publishedProjectsList = projects.filter((p) => p.is_published);

  const recentProjects = [...publishedProjectsList].sort(
    (a, b) => getProjectTimestamp(b) - getProjectTimestamp(a)
  );

  async function reloadProjects() {
    try {
      const res = await fetch("/api/admin/works");

      if (res.ok) {
        const data = await res.json();

        if (Array.isArray(data)) {
          setProjects(data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(project: CMSProject) {
    if (
      !confirm(
        `Are you sure you want to delete "${project.title_en}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(project.id);

    try {
      const res = await fetch(`/api/admin/works/${project.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } else {
        alert("Failed to delete project");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    } finally {
      setDeletingId(null);
    }
  }

  const publishedProjects = projects.filter(
    (p) => p.is_published
  ).length;

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
      value: categoriesCount,
      sub: "Active classifications",
      icon: FolderTree,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/admin/categories",
    },
    {
      label: "Testimonials",
      value: testimonialsCount,
      sub: "Client reviews",
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/testimonials",
    },
    {
      label: "Client Logos",
      value: clientsCount,
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
          <button
            type="button"
            onClick={() => setIsAddingProject(true)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#e05807]"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
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

                <div className="mt-1 text-xs text-slate-500">
                  {s.sub}
                </div>
              </div>

              <div
                className={`grid h-12 w-12 place-items-center rounded-xl ${s.bg} ${s.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Content Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Quick Content Actions
        </h2>

        {/* Mobile: same width + centered content
            Desktop: existing auto-width layout */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {/* Add New Project */}
          <button
            type="button"
            onClick={() => setIsAddingProject(true)}
            className="inline-flex h-10 w-[190px] items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 shrink-0 text-orange" />
            <span className="text-center">Add New Project</span>
          </button>

          {/* Add Testimonial */}
          <Link
            href="/admin/testimonials"
            className="inline-flex h-10 w-[190px] items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 shrink-0 text-orange" />
            <span className="text-center">Add Testimonial</span>
          </Link>

          {/* Add Client Logo */}
          <Link
            href="/admin/clients"
            className="inline-flex h-10 w-[190px] items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange sm:w-auto"
          >
            <Plus className="h-3.5 w-3.5 shrink-0 text-orange" />
            <span className="text-center">Add Client Logo</span>
          </Link>

          {/* Manage Categories */}
          <Link
            href="/admin/categories"
            className="inline-flex h-10 w-[190px] items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-700 transition-colors hover:border-orange hover:bg-orange/5 hover:text-orange sm:w-auto"
          >
            <FolderTree className="h-3.5 w-3.5 shrink-0 text-orange" />
            <span className="text-center">Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-400"
                  >
                    No published projects found.
                  </td>
                </tr>
              ) : (
                recentProjects.slice(0, 8).map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.cover_image}
                          alt={p.title_en}
                          className="h-10 w-14 shrink-0 rounded-lg border border-slate-200 object-cover"
                        />

                        <div>
                          <div className="font-semibold text-slate-900">
                            {p.title_en}
                          </div>

                          <div className="text-xs text-slate-400">
                            {p.title_ar || "No Arabic title"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {p.category_slug}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {p.is_published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProject(p)}
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          title="Edit Project"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          disabled={deletingId === p.id}
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {(isAddingProject || editingProject) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 animate-fade-in sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddingProject(false);
              setEditingProject(null);
            }
          }}
        >
          <div className="relative my-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <ProjectForm
              initialData={editingProject || undefined}
              isEdit={!!editingProject}
              onSuccess={() => {
                setIsAddingProject(false);
                setEditingProject(null);
                reloadProjects();
              }}
              onCancel={() => {
                setIsAddingProject(false);
                setEditingProject(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}