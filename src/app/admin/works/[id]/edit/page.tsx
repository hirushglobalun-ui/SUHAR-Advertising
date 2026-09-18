import { notFound } from "next/navigation";
import { getCMSProjectById } from "@/lib/firebase/db";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getCMSProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialData={project} isEdit={true} />;
}
