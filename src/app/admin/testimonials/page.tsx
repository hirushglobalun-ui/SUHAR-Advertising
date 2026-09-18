"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Star,
  X,
  Save,
  Sliders,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import type { CMSTestimonial } from "@/types/cms";

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<CMSTestimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(3);
  const [customCountInput, setCustomCountInput] = useState<string>("3");
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials?settings=true", { cache: "no-store" });
      const data = await res.json();
      if (data?.testimonials && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
        if (typeof data?.settings?.testimonial_display_count !== "undefined") {
          const count = Number(data.settings.testimonial_display_count);
          setDisplayCount(count);
          setCustomCountInput(count === 0 ? "" : String(count));
        }
      } else if (Array.isArray(data)) {
        setTestimonials(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateDisplayLimit(count: number) {
    setDisplayCount(count);
    setCustomCountInput(count === 0 ? "" : String(count));
    setUpdatingSettings(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonial_display_count: count }),
      });
      if (res.ok) {
        setSettingsSavedMessage(true);
        setTimeout(() => setSettingsSavedMessage(false), 3000);
      }
    } catch (e) {
      console.error("Save display limit error:", e);
    } finally {
      setUpdatingSettings(false);
    }
  }

  function handleCustomCountSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseInt(customCountInput.trim(), 10);
    if (isNaN(parsed) || parsed < 1) {
      updateDisplayLimit(0); // 0 means Show All
    } else {
      updateDisplayLimit(parsed);
    }
  }

  async function togglePublish(t: CMSTestimonial) {
    const updated = !t.is_published;
    setTestimonials((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, is_published: updated } : item))
    );

    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, is_published: updated }),
      });
    } catch (e) {
      console.error("Toggle publish error:", e);
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, is_published: !updated } : item))
      );
    }
  }

  async function updateOrder(t: CMSTestimonial, newOrder: number) {
    const validOrder = Math.max(1, newOrder || 1);
    setTestimonials((prev) =>
      prev.map((item) => (item.id === t.id ? { ...item, display_order: validOrder } : item))
    );

    try {
      await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...t, display_order: validOrder }),
      });
    } catch (e) {
      console.error("Update order error:", e);
    }
  }

  // Move item up or down in sorted order and cleanly re-index
  async function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedTestimonials.length) return;

    setReordering(true);
    const reordered = [...sortedTestimonials];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    // Re-assign sequential orders 1, 2, 3...
    const cleanOrders = reordered.map((item, i) => ({
      ...item,
      display_order: i + 1,
    }));

    setTestimonials(cleanOrders);

    try {
      await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orders: cleanOrders.map((t) => ({ id: t.id, display_order: t.display_order })),
        }),
      });
    } catch (e) {
      console.error("Move item error:", e);
    } finally {
      setReordering(false);
    }
  }

  // Auto-clean all orders to 1, 2, 3...
  async function autoCleanOrders() {
    setReordering(true);
    const cleanOrders = sortedTestimonials.map((item, i) => ({
      ...item,
      display_order: i + 1,
    }));

    setTestimonials(cleanOrders);

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orders: cleanOrders.map((t) => ({ id: t.id, display_order: t.display_order })),
        }),
      });
      if (res.ok) {
        setSettingsSavedMessage(true);
        setTimeout(() => setSettingsSavedMessage(false), 3000);
      }
    } catch (e) {
      console.error("Clean orders error:", e);
    } finally {
      setReordering(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    try {
      const isEdit = !!editingItem.id;
      const url = isEdit
        ? `/api/admin/testimonials/${editingItem.id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setEditingItem(null);
        await loadTestimonials();
      } else {
        alert("Failed to save testimonial");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Sort testimonials deterministically by display_order, then id
  const sortedTestimonials = [...testimonials].sort((a, b) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id || "").localeCompare(b.id || "");
  });

  const publishedTestimonials = sortedTestimonials.filter((t) => t.is_published);
  const effectiveCount =
    displayCount === 0
      ? publishedTestimonials.length
      : Math.min(publishedTestimonials.length, displayCount);

  // Detect duplicate display order numbers
  const orderCountMap: Record<number, number> = {};
  testimonials.forEach((t) => {
    const num = t.display_order ?? 1;
    orderCountMap[num] = (orderCountMap[num] || 0) + 1;
  });
  const duplicateOrders = Object.keys(orderCountMap)
    .map(Number)
    .filter((n) => orderCountMap[n] > 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
            Testimonials Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Set website display limit, order testimonials, and control live visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {duplicateOrders.length > 0 && (
            <button
              onClick={autoCleanOrders}
              disabled={reordering}
              title="Click to automatically re-number testimonials 1, 2, 3... to fix duplicate orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Fix Duplicate Orders</span>
            </button>
          )}

          <button
            onClick={() =>
              setEditingItem({
                person_name_en: "",
                person_name_ar: "",
                designation_en: "",
                designation_ar: "",
                company_en: "",
                company_ar: "",
                text_en: "",
                text_ar: "",
                rating: 5,
                is_published: true,
                display_order: testimonials.length + 1,
              })
            }
            className="inline-flex items-center gap-2 rounded-xl bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#d85507] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Duplicate Order Warning Banner */}
      {duplicateOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Duplicate Display Orders detected: </span>
              Order #{duplicateOrders.join(", #")} is shared by multiple testimonials.
              Click the button to automatically sequence them 1, 2, 3... so each has a distinct position.
            </div>
          </div>
          <button
            onClick={autoCleanOrders}
            disabled={reordering}
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-1.5 font-bold text-white hover:bg-amber-700 cursor-pointer"
          >
            Auto-Clean (1, 2, 3...)
          </button>
        </div>
      )}

      {/* Website Display Controls Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-orange" />
              <h2 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">
                Website Display Controls (How Many & Which to Show)
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Specify the exact number of testimonials to show on the public website. Enter any number (e.g. 1, 3, 5, 10) or choose Show All.
            </p>
          </div>

          {/* Live Status Pill */}
          <div
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold border ${
              effectiveCount > 0
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {effectiveCount} of {publishedTestimonials.length} active testimonials live on website
              {displayCount > 0 ? ` (Limit: ${displayCount})` : " (Limit: All)"}
            </span>
          </div>
        </div>

        {/* Display Limit Form & Presets */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pt-4 border-t border-slate-100">
          <form
            onSubmit={handleCustomCountSubmit}
            className="flex flex-wrap items-center gap-3"
          >
            <label className="text-xs font-bold text-slate-700">
              Testimonials limit on website:
            </label>

            {/* Direct Number Input + Stepper */}
            <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-1 shadow-xs focus-within:border-orange focus-within:bg-white">
              <button
                type="button"
                onClick={() => {
                  const current = displayCount === 0 ? publishedTestimonials.length : displayCount;
                  const next = Math.max(1, current - 1);
                  updateDisplayLimit(next);
                }}
                disabled={updatingSettings}
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                title="Decrease by 1"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="99"
                placeholder="All"
                value={customCountInput}
                onChange={(e) => setCustomCountInput(e.target.value)}
                onBlur={handleCustomCountSubmit}
                className="w-14 bg-transparent text-center text-xs font-bold text-slate-900 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const current = displayCount === 0 ? publishedTestimonials.length : displayCount;
                  const next = current + 1;
                  updateDisplayLimit(next);
                }}
                disabled={updatingSettings}
                className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                title="Increase by 1"
              >
                +
              </button>
            </div>

            <button
              type="submit"
              disabled={updatingSettings}
              className="rounded-xl bg-orange px-3.5 py-2 text-xs font-bold text-white hover:bg-[#d85507] cursor-pointer"
            >
              Apply Limit
            </button>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
              {[3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateDisplayLimit(num)}
                  disabled={updatingSettings}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    displayCount === num
                      ? "bg-navy text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                onClick={() => updateDisplayLimit(0)}
                disabled={updatingSettings}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  displayCount === 0
                    ? "bg-navy text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Show All
              </button>
            </div>

            {settingsSavedMessage && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
                <Check className="h-3.5 w-3.5" /> Saved!
              </span>
            )}
          </form>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-md">
            💡 <strong>How it works:</strong> The website displays the top {displayCount === 0 ? "all" : displayCount} active testimonials according to their Display Order (#1, #2, #3...). Use the ▲ and ▼ buttons on each card to change order.
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingItem(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-display text-lg font-bold text-slate-900">
                {editingItem.id ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <button
                onClick={() => setEditingItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <span className="grid h-5 w-5 place-items-center rounded bg-emerald-600 text-[10px] font-bold text-white">
                AI
              </span>
              <span>English only required — Arabic translation is generated automatically by AI!</span>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Person Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.person_name_en || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, person_name_en: e.target.value })
                    }
                    placeholder="e.g. Ahmed Al-Balushi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Designation (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.designation_en || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, designation_en: e.target.value })
                    }
                    placeholder="e.g. Marketing Director"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Company Name (English)
                  </label>
                  <input
                    type="text"
                    value={editingItem.company_en || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, company_en: e.target.value })
                    }
                    placeholder="e.g. Muscat Retail Group"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.display_order ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        display_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white"
                  />
                </div>
              </div>

              {/* Review Star Rating Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Review Rating (Stars) *
                  </label>
                  <span className="text-xs font-bold text-amber-600">
                    {editingItem.rating ?? 5} out of 5 Stars
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  {/* Interactive Star Buttons */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const currentRating = editingItem.rating ?? 5;
                      const isFilled = starValue <= currentRating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() =>
                            setEditingItem({ ...editingItem, rating: starValue })
                          }
                          className="group p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                          title={`Set to ${starValue} star${starValue > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              isFilled
                                ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                                : "fill-slate-200 text-slate-300 group-hover:fill-amber-200 group-hover:text-amber-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, rating: num })}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                          (editingItem.rating ?? 5) === num
                            ? "bg-amber-500 text-white shadow-xs"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {num}★
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Testimonial Quote (English) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.text_en || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, text_en: e.target.value })
                  }
                  placeholder="What the client said about Suhar's work..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm outline-none focus:border-orange focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_published ?? true}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, is_published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-orange focus:ring-orange accent-orange"
                  />
                  <span className="text-xs font-bold text-slate-700">Active (eligible to show on website)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-orange px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507] cursor-pointer"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{saving ? "Saving..." : "Save Testimonial"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-sm text-slate-400">
            Loading testimonials...
          </div>
        ) : (
          sortedTestimonials.map((t, idx) => {
            const publishedIndex = publishedTestimonials.findIndex((p) => p.id === t.id);
            const isLiveOnSite =
              t.is_published && (displayCount === 0 || publishedIndex < displayCount);
            const isReserve = t.is_published && !isLiveOnSite;
            const isDuplicate = (orderCountMap[t.display_order ?? 1] || 0) > 1;

            return (
              <div
                key={t.id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-xs transition-all ${
                  isLiveOnSite
                    ? "border-emerald-300 ring-2 ring-emerald-500/10 hover:border-emerald-400 hover:shadow-md"
                    : isReserve
                    ? "border-amber-200 bg-amber-50/20 hover:border-amber-300"
                    : "border-slate-200 opacity-60 hover:opacity-100"
                }`}
              >
                <div>
                  {/* Top Bar: Stars + Live Badge / Toggle */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(t)}
                      className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2 py-1 border border-slate-200/60 hover:border-amber-400/50 hover:bg-amber-50/40 transition-all cursor-pointer group"
                      title={`Rated ${t.rating ?? 5} / 5 stars - Click to edit`}
                    >
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= (t.rating ?? 5)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 group-hover:text-amber-600">
                        {t.rating ?? 5}/5
                      </span>
                    </button>

                    {/* Accurate 3-State Status Badge */}
                    <div className="flex items-center gap-1.5">
                      {isLiveOnSite ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 text-[11px] font-bold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live on Site (#{publishedIndex + 1})</span>
                        </span>
                      ) : isReserve ? (
                        <span
                          title={`Active testimonial, but waiting in reserve because website limit is set to top ${displayCount}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 text-[11px] font-bold"
                        >
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>In Reserve (#{publishedIndex + 1})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-300 px-3 py-1 text-[11px] font-bold">
                          <EyeOff className="h-3 w-3 text-slate-400" />
                          <span>Hidden</span>
                        </span>
                      )}

                      {/* Instant Toggle Visibility */}
                      <button
                        type="button"
                        onClick={() => togglePublish(t)}
                        title={t.is_published ? "Click to Hide this testimonial" : "Click to Publish this testimonial"}
                        className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        {t.is_published ? (
                          <Eye className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Reserve Notice if active but cut off by limit */}
                  {isReserve && (
                    <div className="mt-3 rounded-xl bg-amber-50 px-3 py-1.5 text-[11px] text-amber-800 border border-amber-200 leading-tight">
                      Active, but not shown on website because limit is top {displayCount}. Move this up or increase limit to show it.
                    </div>
                  )}

                  {/* Quote */}
                  <p className="mt-4 text-xs italic text-slate-700 leading-relaxed font-serif">
                    &ldquo;{t.text_en}&rdquo;
                  </p>
                  {t.text_ar && (
                    <p className="mt-2 text-xs italic text-slate-400 leading-relaxed rtl:text-right" dir="rtl">
                      &ldquo;{t.text_ar}&rdquo;
                    </p>
                  )}
                </div>

                {/* Bottom Row: Details + Order Controls + Action Buttons */}
                <div className="mt-6 border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t.person_name_en}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                        {t.designation_en}, {t.company_en}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingItem(t)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-orange/10 hover:text-orange transition-colors cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Controls: Up / Down arrows + Order Number + Conflict Detection */}
                  <div
                    className={`flex items-center justify-between rounded-xl px-3 py-1.5 border text-[11px] ${
                      isDuplicate
                        ? "bg-amber-50 border-amber-300 text-amber-900"
                        : "bg-slate-50 border-slate-100 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">Display Order:</span>
                      {isDuplicate && (
                        <span className="font-bold text-amber-600 text-[10px]">
                          (Duplicate!)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Move Up */}
                      <button
                        type="button"
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0 || reordering}
                        title="Move Up"
                        className="grid h-6 w-6 place-items-center rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        onClick={() => moveItem(idx, "down")}
                        disabled={idx === sortedTestimonials.length - 1 || reordering}
                        title="Move Down"
                        className="grid h-6 w-6 place-items-center rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      {/* Manual Order Input */}
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">#</span>
                        <input
                          type="number"
                          min="1"
                          value={t.display_order ?? 1}
                          onChange={(e) =>
                            updateOrder(t, parseInt(e.target.value, 10) || 1)
                          }
                          className="w-12 rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-center font-bold text-slate-800 outline-none focus:border-orange text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
