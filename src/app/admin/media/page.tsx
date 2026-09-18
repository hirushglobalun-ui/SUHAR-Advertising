"use client";

import { useState } from "react";
import { Check, Copy, Image as ImageIcon, Upload } from "lucide-react";

export default function MediaAdminPage() {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "/assets/portfolio-1.jpg",
    "/assets/portfolio-2.jpg",
    "/assets/portfolio-3.jpg",
    "/assets/portfolio-4.jpg",
    "/assets/portfolio-5.jpg",
    "/assets/portfolio-6.jpg",
    "/assets/Suharhero.webp",
    "/assets/about.jpg",
  ]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          setUploadedFiles((prev) => [json.url, ...prev]);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setUploading(false);
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
          Media Asset Library
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload and manage photos and graphics used across your portfolio works and client logos
        </p>
      </div>

      {/* Uploader Card */}
      <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center shadow-xs transition-colors hover:border-orange/50">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange/10 text-orange">
          <Upload className="h-6 w-6" />
        </div>
        <h2 className="mt-3 text-sm font-bold text-slate-900">
          Upload Photos & Logos
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          PNG, JPG, WebP, or SVG up to 10MB each
        </p>

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#d85507]">
          <Upload className="h-4 w-4" />
          <span>{uploading ? "Uploading..." : "Select Files from Computer"}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Available Media Files ({uploadedFiles.length})
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {uploadedFiles.map((url, i) => (
            <div
              key={i}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img src={url} alt={`Media ${i}`} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="truncate text-[10px] font-mono text-slate-500 max-w-[90px]">
                  {url.split("/").pop()}
                </span>
                <button
                  onClick={() => handleCopy(url)}
                  className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-orange"
                  title="Copy URL"
                >
                  {copiedUrl === url ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
