"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Save,
  Sparkles,
  Layers,
  X,
} from "lucide-react";
import type { CMSProject, Category } from "@/types/cms";
import { compressImage } from "@/lib/imageCompressor";

interface ProjectFormProps {
  initialData?: CMSProject;
  isEdit?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  initialData,
  isEdit,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Validation states
  const [coverError, setCoverError] = useState("");
  const [galleryError, setGalleryError] = useState("");

  // Refs for scrolling to the exact invalid section
  const coverRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CMSProject>>({
    title_en: initialData?.title_en || "",
    title_ar: initialData?.title_ar || "",
    subtitle_en: initialData?.subtitle_en || "",
    subtitle_ar: initialData?.subtitle_ar || "",
    category_slug: initialData?.category_slug || "Signage",
    client_en: initialData?.client_en || "",
    client_ar: initialData?.client_ar || "",
    year:
      initialData?.year || new Date().getFullYear().toString(),
    location_en:
      initialData?.location_en || "Muscat, Sultanate of Oman",
    location_ar: initialData?.location_ar || "",
    overview_en: initialData?.overview_en || "",
    overview_ar: initialData?.overview_ar || "",
    cover_image: initialData?.cover_image || "",
    gallery: initialData?.gallery || [],
    is_published: initialData?.is_published ?? true,
    is_featured: initialData?.is_featured ?? false,
    display_order: initialData?.display_order || 1,
  });

  // Display-only filenames
  const [coverFileName, setCoverFileName] = useState<string>(
    initialData?.cover_image
      ? initialData.cover_image.split("/").pop() || ""
      : ""
  );

  const [galleryFileNames, setGalleryFileNames] = useState<string[]>(
    initialData?.gallery?.map(
      (url) => url.split("/").pop() || ""
    ) || []
  );

  // Sync initialData if props update
  useEffect(() => {
    if (initialData) {
      setFormData({
        title_en: initialData.title_en || "",
        title_ar: initialData.title_ar || "",
        subtitle_en: initialData.subtitle_en || "",
        subtitle_ar: initialData.subtitle_ar || "",
        category_slug: initialData.category_slug || "Signage",
        client_en: initialData.client_en || "",
        client_ar: initialData.client_ar || "",
        year: initialData.year || new Date().getFullYear().toString(),
        location_en: initialData.location_en || "Muscat, Sultanate of Oman",
        location_ar: initialData.location_ar || "",
        overview_en: initialData.overview_en || "",
        overview_ar: initialData.overview_ar || "",
        cover_image: initialData.cover_image || "",
        gallery: Array.isArray(initialData.gallery) ? initialData.gallery : [],
        is_published: initialData.is_published ?? true,
        is_featured: initialData.is_featured ?? false,
        display_order: initialData.display_order || 1,
      });
      setCoverFileName(
        initialData.cover_image ? initialData.cover_image.split("/").pop() || "" : ""
      );
      setGalleryFileNames(
        initialData.gallery
          ? initialData.gallery.map((url) => url.split("/").pop() || "")
          : []
      );
    }
  }, [initialData]);

  // Clear image validation errors when images are added
  useEffect(() => {
    if (coverError && formData.cover_image?.trim()) {
      setCoverError("");
    }

    const galleryCount = (formData.gallery || []).filter(
      (image) => image?.trim()
    ).length;

    if (galleryError && galleryCount >= 1) {
      setGalleryError("");
    }
  }, [
    formData.cover_image,
    formData.gallery,
    coverError,
    galleryError,
  ]);

  // Load categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((error) => {
        console.error("Failed to load categories:", error);
      });
  }, []);

  // Upload helper
  async function uploadFile(file: File): Promise<string | null> {
    try {
      const { file: optimized } = await compressImage(file);

      const data = new FormData();
      data.append("file", optimized);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        console.error("Image upload failed:", response.status);
        return null;
      }

      const json = await response.json();

      if (!json?.url) {
        console.error("Upload response does not contain a URL.");
        return null;
      }

      return json.url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  }

  // Cover image upload
  async function handleCoverUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingCover(true);

    try {
      const url = await uploadFile(file);

      if (url) {
        setFormData((previous) => ({
          ...previous,
          cover_image: url,
        }));

        // Display original uploaded filename
        setCoverFileName(file.name);

        // Clear cover validation error
        setCoverError("");
      }
    } finally {
      setUploadingCover(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  }

  // Gallery image upload
  async function handleGalleryUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setUploadingGallery(true);

    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];

        const url = await uploadFile(file);

        if (url) {
          setFormData((previous) => ({
            ...previous,
            gallery: [
              ...(previous.gallery || []),
              url,
            ],
          }));

          // Store original filename separately for UI
          setGalleryFileNames((previous) => [
            ...previous,
            file.name,
          ]);
        }
      }

      // One gallery image is enough
      setGalleryError("");
    } finally {
      setUploadingGallery(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  }

  // Remove gallery image
  function handleRemoveGalleryImage(index: number) {
    setFormData((previous) => ({
      ...previous,
      gallery: previous.gallery?.filter(
        (_, imageIndex) => imageIndex !== index
      ),
    }));

    setGalleryFileNames((previous) =>
      previous.filter(
        (_, fileIndex) => fileIndex !== index
      )
    );
  }

  // Submit / Publish
  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (saving) return;

    console.log("PUBLISH CLICKED");
    console.log("Cover image:", formData.cover_image);
    console.log("Gallery images:", formData.gallery);

    setSaving(true);

    try {
      /*
       * IMAGE VALIDATION
       *
       * Cover image = mandatory
       * Gallery = minimum 1 image
       */
      if (formData.is_published) {
        let hasError = false;

        const coverMissing =
          !formData.cover_image?.trim();

        const galleryCount =
          (formData.gallery || []).filter(
            (image) => image?.trim()
          ).length;

        const galleryMissing =
          galleryCount < 1;

        // Cover validation
        if (coverMissing) {
          setCoverError(
            "Cover image is required to publish the project."
          );

          hasError = true;
        } else {
          setCoverError("");
        }

        // Gallery validation
        if (galleryMissing) {
          setGalleryError(
            "At least 1 gallery image is required to publish the project."
          );

          hasError = true;
        } else {
          setGalleryError("");
        }

        // Stop publishing and move to the first invalid section
        if (hasError) {
          if (coverMissing) {
            requestAnimationFrame(() => {
              coverRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            });
          } else if (galleryMissing) {
            requestAnimationFrame(() => {
              galleryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            });
          }

          setSaving(false);
          return;
        }
      }

      /*
       * API REQUEST
       */
      const endpoint =
        isEdit && initialData?.id
          ? `/api/admin/works/${initialData.id}`
          : "/api/admin/works";

      const method = isEdit ? "PUT" : "POST";

      console.log("Publish endpoint:", endpoint);
      console.log("Publish method:", method);
      console.log("Publish payload:", formData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let responseData: unknown = null;

      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      console.log(
        "Publish response:",
        response.status,
        responseData
      );

      if (!response.ok) {
        const errorMessage =
          typeof responseData === "object" &&
            responseData !== null &&
            "error" in responseData &&
            typeof responseData.error === "string"
            ? responseData.error
            : "Failed to save project";

        throw new Error(errorMessage);
      }

      /*
       * SUCCESS
       */
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/works");
        router.refresh();
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to save project";
      console.error("Error saving project:", msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-8 max-w-5xl ${onCancel ? "" : "pb-16"
        }`}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <Link
              href="/admin/works"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          <div>
            <h1 className="font-display text-2xl font-black text-slate-900">
              {isEdit
                ? "Edit Project"
                : "Add New Project"}
            </h1>

            <p className="text-xs text-slate-500">
              Fill in English only — Arabic version will be automatically translated with AI.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#e05807] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />

          <span>
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Project"
                : "Publish Project"}
          </span>
        </button>
      </div>

      {/* AI Notice */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-800">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
          AI
        </span>

        <div>
          <p className="font-bold">
            English-Only Mode Active
          </p>

          <p className="text-[11px] text-emerald-700">
            You only need to enter details in English.
            Our system automatically translates everything
            into professional Arabic for the bilingual live
            site.
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-orange" />
          <span>
            Project Information (English)
          </span>
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Project Title (EN) *
              </label>

              <input
                type="text"
                required
                value={formData.title_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title_en: e.target.value,
                  })
                }
                placeholder="e.g. Al-Fanar Tower Signage"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Subtitle / Type (EN)
              </label>

              <input
                type="text"
                value={formData.subtitle_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subtitle_en: e.target.value,
                  })
                }
                placeholder="e.g. Illuminated Facade Signage & 3D Letters"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Category
              </label>

              <select
                value={formData.category_slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_slug: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.slug}
                  >
                    {category.name_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Client Name (EN)
              </label>

              <input
                type="text"
                value={formData.client_en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    client_en: e.target.value,
                  })
                }
                placeholder="e.g. Muscat Retail Group"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Year
              </label>

              <input
                type="text"
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value,
                  })
                }
                placeholder="2024"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Location (EN)
            </label>

            <input
              type="text"
              value={formData.location_en}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location_en: e.target.value,
                })
              }
              placeholder="Muscat, Sultanate of Oman"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Project Images */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-orange" />
            <span>
              Project Images & Scrollable Gallery
            </span>
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Upload a cover image and one or more gallery
            images. Visitors can slide/scroll through these
            images on the project page.
          </p>
        </div>

        {/* Cover Image */}
        <div
          ref={coverRef}
          className={`space-y-2 rounded-2xl transition-all ${coverError
              ? "border border-red-300 bg-red-50/40 p-4"
              : ""
            }`}
        >
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Main Cover Image
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative aspect-[16/10] h-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {formData.cover_image ? (
                <img
                  src={formData.cover_image}
                  alt="Cover Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-slate-400">
                  <ImageIcon className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:border-orange hover:text-orange cursor-pointer transition-all">
                <Upload className="h-3.5 w-3.5" />

                <span>
                  {uploadingCover
                    ? "Uploading Cover..."
                    : "Upload New Cover Image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  disabled={uploadingCover}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={coverFileName}
                readOnly
                placeholder="Cover image filename"
                className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 outline-none"
              />
            </div>
          </div>

          {coverError && (
            <p className="text-xs font-medium text-red-600">
              {coverError}
            </p>
          )}
        </div>

        {/* Gallery */}
        <div
          ref={galleryRef}
          className={`border-t border-slate-100 pt-5 space-y-3 rounded-2xl transition-all ${galleryError
              ? "border-red-300 bg-red-50/30 p-4"
              : ""
            }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Gallery Photos (
                {formData.gallery?.length || 0} images)
              </label>

              <span className="text-[11px] text-slate-500">
                Add one or more images. These appear in
                the horizontal scrollable gallery.
              </span>

              {galleryError && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {galleryError}
                </p>
              )}
            </div>

            <label className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-orange transition-all cursor-pointer">
              <Plus className="h-3.5 w-3.5" />

              <span>
                {uploadingGallery
                  ? "Uploading..."
                  : "Add Images to Gallery"}
              </span>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
              />
            </label>
          </div>

          {/* Gallery Grid */}
          {formData.gallery &&
            formData.gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
              {formData.gallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveGalleryImage(index)
                      }
                      aria-label="Remove image"
                      className="grid h-8 w-8 place-items-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="absolute bottom-1.5 left-1.5 max-w-[90%] truncate rounded-md bg-slate-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {galleryFileNames[index] ||
                      `Image ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
              <ImageIcon className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-2 text-xs font-medium">
                No gallery images added yet.
              </p>

              <p className="text-[11px] text-slate-400">
                Click “Add Images to Gallery” above to
                upload one or more photos.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Layers className="h-4 w-4 text-orange" />
          <span>
            Project Description & Overview
          </span>
        </h2>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Project Description (English)
          </label>

          <textarea
            rows={5}
            value={formData.overview_en}
            onChange={(e) =>
              setFormData({
                ...formData,
                overview_en: e.target.value,
              })
            }
            placeholder="Describe the project scope, materials used, engineering precision, visual elegance, and final outcome..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-orange focus:bg-white leading-relaxed"
          />

          <p className="mt-1.5 text-[11px] text-slate-400">
            ✨ This description will be automatically
            translated to Arabic by AI when saved.
          </p>
        </div>
      </div>

      {/* Publishing */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <h2 className="font-display text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Publishing & Display
        </h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-orange/40 transition-colors">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_published: e.target.checked,
                })
              }
              className="h-4 w-4 rounded text-orange focus:ring-orange accent-orange"
            />

            <div>
              <div className="text-xs font-bold text-slate-800">
                Published
              </div>

              <div className="text-[11px] text-slate-500">
                Visible on the public website
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 cursor-pointer hover:border-orange/40 transition-colors">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_featured: e.target.checked,
                })
              }
              className="h-4 w-4 rounded text-orange focus:ring-orange accent-orange"
            />

            <div>
              <div className="text-xs font-bold text-slate-800">
                Featured
              </div>

              <div className="text-[11px] text-slate-500">
                Prioritized on homepage
              </div>
            </div>
          </label>

          <div className="rounded-2xl border border-slate-200 p-4">
            <label className="block text-xs font-bold text-slate-800">
              Display Order
            </label>

            <input
              type="number"
              value={formData.display_order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  display_order:
                    parseInt(e.target.value) || 1,
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-semibold text-slate-800 outline-none focus:border-orange"
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
        ) : (
          <Link
            href="/admin/works"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all"
          >
            Cancel
          </Link>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#e05807] transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />

          <span>
            {saving
              ? "Saving..."
              : isEdit
                ? "Update Project"
                : "Publish Project"}
          </span>
        </button>
      </div>
    </form>
  );
}