"use client";

import { useState } from "react";
import { CloudUpload, CheckCircle2, Loader2 } from "lucide-react";

export function FirebaseSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSync = async () => {
    if (!confirm("Do you want to sync existing default projects, categories, testimonials, and clients to your live Firebase database? This ensures your Firestore collections are populated.")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync");
      setResult(`Synced ${data.counts.projects} projects, ${data.counts.categories} categories, ${data.counts.testimonials} testimonials, ${data.counts.clients} clients to Firestore!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error syncing to Firebase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {result ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          {result}
        </span>
      ) : (
        <button
          type="button"
          onClick={handleSync}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-orange hover:text-orange hover:bg-slate-50 transition-all disabled:opacity-60 cursor-pointer"
          title="Seed and sync default portfolio items into your live Firebase Firestore database"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-orange" />
          ) : (
            <CloudUpload className="h-3.5 w-3.5 text-orange" />
          )}
          <span>{loading ? "Syncing to Firebase..." : "Seed Firebase Data"}</span>
        </button>
      )}
    </div>
  );
}
