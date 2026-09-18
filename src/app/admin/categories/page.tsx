"use client";

import { useEffect, useState } from "react";
import { FolderTree, Plus, Trash2, Check } from "lucide-react";
import type { Category } from "@/types/cms";

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameEn, setNameEn] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!nameEn.trim()) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en: nameEn.trim(),
          slug: nameEn.trim(),
          display_order: categories.length + 1,
        }),
      });

      if (res.ok) {
        setNameEn("");
        await loadCategories();
      } else {
        alert("Failed to add category");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
          Project Categories Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage categories used for classifying works and portfolio filter tabs
        </p>
      </div>

      {/* Add Category Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Add New Category
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            ✨ AI Auto-Translates to Arabic
          </span>
        </div>
        <form onSubmit={handleAddCategory} className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Category Name (English) *</label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. 3D Lettering, Architectural Signage"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-orange focus:bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange px-6 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507] disabled:opacity-50 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{saving ? "Adding with AI..." : "Add Category"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-sm font-semibold text-slate-400">Loading categories...</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Category Name (English)</th>
                <th className="px-6 py-3.5">اسم التصنيف (Arabic)</th>
                <th className="px-6 py-3.5">Slug ID</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{c.name_en}</td>
                  <td className="px-6 py-3.5 rtl:text-right font-medium text-slate-600">{c.name_ar}</td>
                  <td className="px-6 py-3.5 font-mono text-xs text-slate-400">{c.slug}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                      title="Delete Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
