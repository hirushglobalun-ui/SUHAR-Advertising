"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { CMSProject } from "@/types/cms";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectTimestamp } from "@/lib/utils";

interface RecentProjectsTableProps {
  initialProjects: CMSProject[];
}

export default function RecentProjectsTable({ initialProjects }: RecentProjectsTableProps) {
  const [projects, setProjects] = useState<CMSProject[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const publishedProjects = projects.filter((p) => p.is_published);
  const recentProjects = [...publishedProjects].sort(
    (a, b) => getProjectTimestamp(b) - getProjectTimestamp(a)
  );

  async function reloadProjects() {
    try {
      const res = await fetch("/api/admin/works");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setProjects(data);
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
      const res = await fetch(`/api/admin/works/${project.id}`, { method: "DELETE" });
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

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3">Project</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {recentProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  No published projects found.
                </td>
              </tr>
            ) : (
              recentProjects.slice(0, 5).map((project) => (
              <tr key={project.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={project.cover_image}
                      alt={project.title_en}
                      className="h-10 w-14 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{project.title_en}</div>
                      <div className="text-xs text-slate-400 rtl:text-right">
                        {project.title_ar}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {project.category_slug}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-xs text-slate-600">
                  {project.client_en || "—"}
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
                  <div className="inline-flex items-center justify-end gap-1">
                    {/* Edit Project Button (Modal) */}
                    <button
                      type="button"
                      onClick={() => setEditingProject(project)}
                      className="rounded-lg p-1.5 text-slate-600 hover:bg-orange/10 hover:text-orange transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Delete Project Button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      disabled={deletingId === project.id}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
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

      {/* Edit Project Modal */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProject(null);
          }}
        >
          <div className="relative my-auto w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <ProjectForm
              initialData={editingProject}
              isEdit={true}
              onSuccess={() => {
                setEditingProject(null);
                reloadProjects();
              }}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}
