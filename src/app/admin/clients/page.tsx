"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, Save, Upload } from "lucide-react";
import type { CMSClientLogo } from "@/types/cms";
import { compressImage } from "@/lib/imageCompressor";

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<CMSClientLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<CMSClientLogo> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setClients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const { file: optimized } = await compressImage(file);
      const formData = new FormData();
      formData.append("file", optimized);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setEditingItem((prev) => ({ ...prev, logo_url: json.url }));
      } else {
        alert("Upload failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isEdit = !!editingItem.id;
      const url = isEdit
        ? `/api/admin/clients/${editingItem.id}`
        : "/api/admin/clients";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setEditingItem(null);
        await loadClients();
      } else {
        alert("Failed to save client");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this client logo?")) return;
    try {
      const res = await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
            Client Logos Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage prominent brands and client logos showcased in the public clients marquee
          </p>
        </div>

        <button
          onClick={() =>
            setEditingItem({
              name_en: "",
              name_ar: "",
              logo_url: "",
              is_active: true,
              display_order: clients.length + 1,
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d85507]"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client Logo</span>
        </button>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {editingItem.id ? "Edit Client Logo" : "Add Client Logo"}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="grid h-5 w-5 place-items-center rounded bg-emerald-600 text-[10px] font-bold text-white">
                AI
              </span>
              <span>English only required — Arabic brand name is auto-translated by AI!</span>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Client Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name_en || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name_en: e.target.value })
                  }
                  placeholder="e.g. OMANTEL, BANK MUSCAT"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Client Logo Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {editingItem.logo_url && (
                    <img
                      src={editingItem.logo_url}
                      alt="Logo Preview"
                      className="h-10 w-20 rounded-lg border border-slate-200 bg-slate-50 object-contain p-1"
                    />
                  )}
                  <input
                    type="text"
                    value={editingItem.logo_url ? editingItem.logo_url.split("/").pop() || "" : ""}
                    readOnly
                    placeholder="Uploaded logo filename"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-orange focus:bg-white font-mono"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-orange hover:text-orange shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  If no image is uploaded, the clean text typography badge will be displayed automatically.
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingItem.display_order ?? 1}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      display_order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-orange focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_active ?? true}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, is_active: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-orange focus:ring-orange"
                  />
                  <span className="text-xs font-semibold text-slate-700">Active (Visible on Website)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507]"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{saving ? "Saving..." : "Save"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-slate-400">
            Loading clients...
          </div>
        ) : (
          clients.map((c) => (
            <div
              key={c.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs transition-all hover:border-orange/40 hover:shadow-md"
            >
              <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(c)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-orange transition-colors cursor-pointer"
                  title="Edit Client"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Delete Client"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex h-16 items-center justify-center">
                {c.logo_url ? (
                  <img
                    src={c.logo_url}
                    alt={c.name_en}
                    className="max-h-12 max-w-[120px] object-contain"
                  />
                ) : (
                  <span className="font-display text-base font-extrabold tracking-wider text-[#062D4F]">
                    {c.name_en}
                  </span>
                )}
              </div>

              <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                <div className="truncate font-semibold text-slate-600">{c.name_ar || c.name_en}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      c.is_active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span>{c.is_active ? "Active" : "Hidden"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
