import { z } from "zod";

export const projectInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/i).optional(),
  title_en: z.string().min(1, "English title is required").max(200),
  title_ar: z.string().max(200).optional(),
  subtitle_en: z.string().max(300).optional(),
  subtitle_ar: z.string().max(300).optional(),
  category: z.string().max(100).optional(),
  category_slug: z.string().max(100).optional(),
  client_en: z.string().max(100).optional(),
  client_ar: z.string().max(100).optional(),
  year: z.string().max(20).optional(),
  location_en: z.string().max(100).optional(),
  location_ar: z.string().max(100).optional(),
  overview_en: z.string().min(1, "English overview is required").max(5000),
  overview_ar: z.string().max(5000).optional(),
  challenge_en: z.string().max(5000).optional(),
  challenge_ar: z.string().max(5000).optional(),
  solution_en: z.string().max(5000).optional(),
  solution_ar: z.string().max(5000).optional(),
  deliverables_en: z.array(z.string().max(200)).optional(),
  deliverables_ar: z.array(z.string().max(200)).optional(),
  impact_en: z.array(z.string().max(200)).optional(),
  impact_ar: z.array(z.string().max(200)).optional(),
  cover_image: z.string().max(1000).optional(),
  gallery: z.array(z.string().max(1000)).optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
  display_order: z.number().int().min(1).max(9999).optional(),
});

export const categoryInputSchema = z.object({
  id: z.string().max(100).optional(),
  name_en: z.string().min(1, "English name is required").max(100),
  name_ar: z.string().max(100).optional(),
  description_en: z.string().max(500).optional(),
  description_ar: z.string().max(500).optional(),
  display_order: z.number().int().min(1).max(9999).optional(),
});

export const testimonialInputSchema = z.object({
  id: z.string().optional(),
  person_name_en: z.string().min(1, "Person name is required").max(100),
  person_name_ar: z.string().max(100).optional(),
  designation_en: z.string().max(100).optional(),
  designation_ar: z.string().max(100).optional(),
  company_en: z.string().max(100).optional(),
  company_ar: z.string().max(100).optional(),
  text_en: z.string().min(1, "Testimonial text is required").max(2000),
  text_ar: z.string().max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  photo_url: z.string().max(1000).optional(),
  is_published: z.boolean().optional(),
  display_order: z.number().int().min(1).max(9999).optional(),
});

export const clientLogoInputSchema = z.object({
  id: z.string().optional(),
  name_en: z.string().min(1, "Client name is required").max(100),
  name_ar: z.string().max(100).optional(),
  logo_url: z.string().min(1, "Logo URL is required").max(1000),
  website_url: z.string().max(1000).optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().int().min(1).max(9999).optional(),
});

export const settingsPatchSchema = z.object({
  testimonial_display_count: z.number().int().min(0).max(100).optional(),
  orders: z.array(
    z.object({
      id: z.string().min(1),
      display_order: z.number().int().min(1).max(9999),
    })
  ).optional(),
});

export const translateInputSchema = z.object({
  text: z.string().min(1).max(5000).optional(),
  texts: z.record(z.string().max(5000).optional()).optional(),
}).refine((data) => data.text || data.texts, {
  message: "Either 'text' or 'texts' must be provided",
});
