"use client";
import React from "react";
import { useGetProjectById } from "../api/use-get-project-id";
import Loader from "@/components/Loader";
import ProjectAvatar from "./ProjectAvatar";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import TaskViewSwitcher from "@/modules/tasks/components/TaskViewSwitcher";
interface ProjectViewProps {
  workspaceId: string;
  projectId: string;
}
export default function ProjectView({
  workspaceId,
  projectId,
}: ProjectViewProps) {
  const { data: project, isPending:isProjectPending, error } = useGetProjectById({
    workspaceId,
    projectId,
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            image={project.imageUrl}
            name={project.name}
            className="size-8"
          />
          <span className="text-lg font-semibold">{project.name}</span>
        </div>
        <Button variant={"secondary"} size={"sm"} asChild>
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
            className="cursor-pointer"
          >
            <PencilIcon className="size-4 mr-1"/>
            Edit Project
          </Link>
        </Button>
      </div>
      <TaskViewSwitcher/>
    </div>
  );
}
