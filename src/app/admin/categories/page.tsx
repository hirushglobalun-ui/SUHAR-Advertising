"use client";

import { useEffect, useState } from "react";
import {
  FolderTree,
  Plus,
  Trash2,
  Pencil,
  X,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  Hash,
  Layers,
} from "lucide-react";
import type { Category, CMSProject } from "@/types/cms";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<CMSProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Category State
  const [nameEn, setNameEn] = useState("");
  const [savingNew, setSavingNew] = useState(false);

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState({
    id: "",
    name_en: "",
    name_ar: "",
    slug: "",
    display_order: 1,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [catRes, projRes] = await Promise.all([
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/works", { cache: "no-store" }),
      ]);
      const cats = await catRes.json();
      const projs = await projRes.json();

      if (Array.isArray(cats)) setCategories(cats);
      if (Array.isArray(projs)) setProjects(projs);
    } catch (e) {
      console.error("Error loading categories data:", e);
      showFeedback("error", "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  function showFeedback(type: "success" | "error", text: string) {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!nameEn.trim()) return;
    setSavingNew(true);

    try {
      const slug = nameEn
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en: nameEn.trim(),
          slug: slug || nameEn.trim(),
          display_order: categories.length + 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNameEn("");
        if (data.category) {
          setCategories((prev) => {
            const filtered = prev.filter((c) => c.id !== data.category.id);
            return [...filtered, data.category].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
          });
        }
        showFeedback("success", "Category created & translated automatically!");
        await loadData();
      } else {
        const errorData = await res.json();
        showFeedback("error", errorData.error || "Failed to add category");
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Error creating category");
    } finally {
      setSavingNew(false);
    }
  }

  function startEdit(c: Category) {
    setEditingCategory(c);
    setEditForm({
      id: c.id,
      name_en: c.name_en,
      name_ar: c.name_ar,
      slug: c.slug,
      display_order: c.display_order,
    });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.id || !editForm.name_en.trim()) return;
    setSavingEdit(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editForm.id,
          name_en: editForm.name_en.trim(),
          slug: editForm.slug.trim(),
          display_order: Number(editForm.display_order) || 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEditingCategory(null);
        if (data.category) {
          setCategories((prev) =>
            prev.map((c) => (c.id === data.category.id ? data.category : c)).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
          );
        }
        showFeedback("success", `Category "${editForm.name_en}" updated & translated automatically!`);
        await loadData();
      } else {
        const err = await res.json();
        showFeedback("error", err.error || "Failed to update category");
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Error updating category");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(c: Category) {
    const projectCount = getProjectCount(c);
    if (projectCount > 0) {
      alert(
        `Cannot delete "${c.name_en}" because it currently has ${projectCount} project(s) assigned to it. Please reassign those projects in Works Management first.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete the category "${c.name_en}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${c.id}`, { method: "DELETE" });
      if (res.ok) {
        showFeedback("success", `Category "${c.name_en}" deleted successfully.`);
        setCategories((prev) => prev.filter((item) => item.id !== c.id));
      } else {
        const err = await res.json();
        showFeedback("error", err.error || "Failed to delete category");
      }
    } catch (e) {
      console.error(e);
      showFeedback("error", "Error deleting category");
    }
  }

  function getProjectCount(c: Category) {
    return projects.filter(
      (p) =>
        p.category === c.id ||
        p.category_slug === c.id ||
        p.category === c.slug ||
        p.category_slug === c.slug
    ).length;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-orange" />
            <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
              Project Categories Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage project classifications, multilingual category labels, display order, and slug identifiers
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 cursor-pointer disabled:opacity-50"
          title="Refresh categories"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-orange" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-sm font-medium ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Add Category Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Plus className="h-4 w-4 text-orange" />
            <span>Add New Category</span>
          </h2>
          
        </div>

        <form onSubmit={handleAddCategory} className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Category Name (English) *
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. 3D Lettering, Architectural Signage, Vehicle Branding"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={savingNew || !nameEn.trim()}
              className="inline-flex h-10.5 items-center justify-center gap-2 rounded-xl bg-orange px-6 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507] disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>{savingNew ? "Adding..." : "Add Category"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Categories List ({categories.length})
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm font-semibold text-slate-400">
            <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin text-orange" />
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-sm font-medium text-slate-400">
            No categories created yet. Add one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3.5 w-16 text-center">Order</th>
                  <th className="px-6 py-3.5">Category Name (English)</th>
                  <th className="px-6 py-3.5">اسم التصنيف (Arabic)</th>
                  <th className="px-6 py-3.5">Slug ID</th>
                  <th className="px-6 py-3.5 text-center">Projects</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {categories.map((c) => {
                  const projectCount = getProjectCount(c);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 text-center">
                        <span className="inline-flex items-center justify-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-600">
                          #{c.display_order ?? 1}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        {c.name_en}
                      </td>
                      <td className="px-6 py-3.5 rtl:text-right font-medium text-slate-700">
                        {c.name_ar || "—"}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-slate-500">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">
                          {c.slug}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            projectCount > 0
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {projectCount} {projectCount === 1 ? "project" : "projects"}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => startEdit(c)}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-orange/10 hover:text-orange transition-colors cursor-pointer"
                            title="Edit Category"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(c)}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCategory(null);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-orange/10 text-orange">
                  <Pencil className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-900">
                    Edit Category
                  </h2>
                  <p className="text-xs text-slate-400">ID: {editingCategory.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name_en}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val
                      .trim()
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");
                    setEditForm({
                      ...editForm,
                      name_en: val,
                      slug: autoSlug || editForm.slug,
                    });
                  }}
                  placeholder="e.g. 3D Lettering"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                />
              </div>

              {/* AI Auto-Translation Notice */}
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>AI Auto-Translation:</strong> Arabic translation is generated automatically based on the English name.
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  Slug ID * (Identifier used in URLs & project classification)
                </label>
                <input
                  type="text"
                  required
                  value={editForm.slug}
                  onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                  placeholder="e.g. 3d-lettering"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs outline-none transition-colors focus:border-orange focus:bg-white"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Updating this slug will automatically update all existing works assigned to it.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-slate-400" />
                  <span>Display Order</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={editForm.display_order}
                  onChange={(e) =>
                    setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 1 })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-orange focus:bg-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || !editForm.name_en.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507] disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {savingEdit ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
