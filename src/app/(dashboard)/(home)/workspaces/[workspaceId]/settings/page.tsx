"use client";
import NavbarLogo from "@/components/NavbarLogo";
import { useGetWorkspaceById } from "@/modules/workspaces/api/use-get-workspace-id";
import EditWorkspaceForm from "@/modules/workspaces/components/editWorkspaceForm";
import { Workspace } from "@/modules/workspaces/types";
import { LoaderCircleIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

interface WowrkspaceSettingsPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function WorkspaceSettingsPage({}: // params,
WowrkspaceSettingsPageProps) {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { data, isPending } = useGetWorkspaceById(workspaceId);

  const initialValues = data as Workspace;

  if (isPending && !initialValues) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoaderCircleIcon className="text-neutral-500 animate-spin" />
      </div>
    ); // 或者返回一个 Skeleton 骨架屏
  }

  // 2. 处理找不到数据的情况
  if (!initialValues && !isPending) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="flex flex-col gap-18 min-h-screen ">
      <NavbarLogo />
      <div className="flex-1 w-full flex">
        <div className="w-full max-w-2xl mx-auto">
          {initialValues && <EditWorkspaceForm initialValues={initialValues} />}
        </div>
      </div>
    </div>
  );
}
