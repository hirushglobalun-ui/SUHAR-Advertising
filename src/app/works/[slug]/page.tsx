import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { getCMSProjects, getCMSProjectBySlug } from "@/lib/firebase/db";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  try {
    const cmsList = await getCMSProjects();
    if (cmsList && cmsList.length > 0) {
      return cmsList.map((p) => ({ slug: p.slug }));
    }
  } catch (e) {
    console.warn("generateStaticParams CMS fetch error:", e);
  }

  return getAllProjects().map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  try {
    const cmsProject = await getCMSProjectBySlug(slug);
    if (cmsProject) {
      const formatted = {
        slug: cmsProject.slug,
        title: { en: cmsProject.title_en, ar: cmsProject.title_ar },
        subtitle: { en: cmsProject.subtitle_en, ar: cmsProject.subtitle_ar },
        category: { en: cmsProject.category_slug, ar: cmsProject.category_slug },
        client: { en: cmsProject.client_en, ar: cmsProject.client_ar },
        year: cmsProject.year,
        location: { en: cmsProject.location_en, ar: cmsProject.location_ar },
        deliverables: { en: cmsProject.deliverables_en, ar: cmsProject.deliverables_ar },
        overview: { en: cmsProject.overview_en, ar: cmsProject.overview_ar },
        challenge: { en: cmsProject.challenge_en, ar: cmsProject.challenge_ar },
        solution: { en: cmsProject.solution_en, ar: cmsProject.solution_ar },
        impact: { en: cmsProject.impact_en, ar: cmsProject.impact_ar },
        mainImage: cmsProject.cover_image,
        cover_image: cmsProject.cover_image,
        gallery: Array.isArray(cmsProject.gallery) && cmsProject.gallery.length > 0 
          ? cmsProject.gallery.filter((g) => typeof g === "string" && g.trim().length > 0)
          : (cmsProject.cover_image ? [cmsProject.cover_image] : []),
      };
      return <ProjectDetailClient project={formatted} />;
    }
  } catch (e) {
    console.warn("Error fetching CMS project in detail page:", e);
  }

  const staticProject = getProjectBySlug(slug);
  if (!staticProject) {
    notFound();
  }

  return <ProjectDetailClient project={staticProject} />;
}
