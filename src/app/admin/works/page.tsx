"use client";

import { useEffect, useState } from "react";
import {
  Filter,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { CMSProject, Category } from "@/types/cms";
import ProjectForm from "@/components/admin/ProjectForm";

export default function WorksAdminPage() {
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal States
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [projRes, catRes] = await Promise.all([
        fetch("/api/admin/works"),
        fetch("/api/admin/categories"),
      ]);
      const projs = await projRes.json();
      const cats = await catRes.json();
      setProjects(Array.isArray(projs) ? projs : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete the project "${title}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/works/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
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

  async function togglePublish(project: CMSProject) {
    try {
      const updated = { ...project, is_published: !project.is_published };
      const res = await fetch(`/api/admin/works/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? updated : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title_en.toLowerCase().includes(search.toLowerCase()) ||
      p.title_ar.includes(search) ||
      p.client_en.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
            Works & Projects Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, edit, organize, and publish portfolio works
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingProject(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#e05807] cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or client name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-orange focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-colors focus:border-orange focus:bg-white"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name_en} ({c.name_ar})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-slate-400">
            Loading works...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-base font-bold text-slate-700">No projects found</div>
            <p className="mt-1 text-xs text-slate-400">
              Try adjusting your search query or add your first project.
            </p>
            <button
              type="button"
              onClick={() => setIsAddingProject(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2 text-xs font-bold text-white hover:bg-[#e05807] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Image & Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Year</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.cover_image}
                          alt={p.title_en}
                          className="h-12 w-16 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-xs">
                            {p.title_en}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-xs rtl:text-right">
                            {p.title_ar}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {p.category_slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      {p.client_en}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {p.year}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(p)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                          p.is_published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Click to toggle publish status"
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            p.is_published ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {p.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit Project Modal Button */}
                        <button
                          type="button"
                          onClick={() => setEditingProject(p)}
                          className="rounded-lg p-1.5 text-slate-600 hover:bg-orange/10 hover:text-orange transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete Project Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id, p.title_en)}
                          disabled={deletingId === p.id}
                          className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {(isAddingProject || editingProject) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddingProject(false);
              setEditingProject(null);
            }
          }}
        >
          <div className="relative my-auto w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <ProjectForm
              initialData={editingProject || undefined}
              isEdit={!!editingProject}
              onSuccess={() => {
                setIsAddingProject(false);
                setEditingProject(null);
                loadData();
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
