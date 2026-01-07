import ProjectView from "@/modules/projects/components/ProjectView";
import React from "react";
interface ProjectPageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { workspaceId, projectId } = await params;
  return <ProjectView workspaceId={workspaceId} projectId={projectId} />;
}
