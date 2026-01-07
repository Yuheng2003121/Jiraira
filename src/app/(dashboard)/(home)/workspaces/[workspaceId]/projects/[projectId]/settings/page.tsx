"use client";

import Loader from "@/components/Loader";
import { useGetProjectById } from "@/modules/projects/api/use-get-project-id";
import EditProjectForm from "@/modules/projects/components/EditProjectForm";
import { Project } from "@/modules/projects/types";
import { useParams } from "next/navigation";

export default function ProjectSettingPage() {
  const { workspaceId, projectId } = useParams();
  const {
    data: project,
    isPending: isProjectPending,
    error,
  } = useGetProjectById({
    workspaceId: workspaceId as string,
    projectId: projectId as string,
  });

  if (isProjectPending && !project) {
    return <Loader />;
  }

  if (!project) {
    return <div>Project NOt Found</div>;
  }

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      <EditProjectForm initialValues={project as Project}/>
    </div>
  );
}
