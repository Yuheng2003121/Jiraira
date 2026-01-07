"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "../api/use-get-projects";
import Loader from "@/components/Loader";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCreateProjectModalOpen } from "@/store/useCreateProjectModalOpen";
import ProjectAvatar from "./ProjectAvatar";

export default function Projects() {
  const setIsOpen = useCreateProjectModalOpen((state) => state.setIsOpen);
  const { workspaceId } = useParams();
  const pathName = usePathname();
  const { data: projects, isPending } = useGetProjects({
    workspaceId: workspaceId as string,
  });

  if (isPending && !projects) {
    return <Loader />;
  }
  console.log(workspaceId);
  

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase text-neutral-500">
          Projects
        </p>
        <RiAddCircleFill
          className="size-6 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          onClick={() => setIsOpen(true)}
        />
      </div>
      {projects?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
        const isActive = pathName === href;

        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar image={project.imageUrl} name={project.name}/>
              <span className="truncate">{project.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
