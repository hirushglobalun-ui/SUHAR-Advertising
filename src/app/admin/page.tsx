import {
  getCMSProjects,
  getCMSCategories,
  getCMSTestimonials,
  getCMSClients,
} from "@/lib/firebase/db";
import DashboardClient from "@/components/admin/DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, categories, testimonials, clients] = await Promise.all([
    getCMSProjects(),
    getCMSCategories(),
    getCMSTestimonials(),
    getCMSClients(),
  ]);

  return (
    <DashboardClient
      initialProjects={projects}
      categoriesCount={categories.length}
      testimonialsCount={testimonials.length}
      clientsCount={clients.length}
    />
  );
}
