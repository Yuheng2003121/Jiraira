"use client";
import Loader from "@/components/Loader";
import { useGetWorkspaceById } from "@/modules/workspaces/api/use-get-workspace-id";
import EditWorkspaceForm from "@/modules/workspaces/components/EditWorkspaceForm";
import { Workspace } from "@/modules/workspaces/types";
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
      <Loader/>
    ); // 或者返回一个 Skeleton 骨架屏
  }

  // 2. 处理找不到数据的情况
  if (!initialValues && !isPending) {
    return <div>Workspace not found</div>;
  }

  return (
    // <div className="flex flex-col  min-h-screen ">
    //   <NavbarLogo />
    //   <div className="flex-1 w-full flex py-10">
    //     <div className="w-full max-w-2xl mx-auto">
    //       {initialValues && <EditWorkspaceForm initialValues={initialValues} />}
    //     </div>
    //   </div>
    // </div>
    <div className="max-w-2xl mx-auto">
      {initialValues && <EditWorkspaceForm initialValues={initialValues} />}
    </div>
  );
}
