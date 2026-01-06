"use client";

import Loader from "@/components/Loader";
import { useGetWorkspaceById } from "@/modules/workspaces/api/use-get-workspace-id";
import WorksapceJoinView from "@/modules/workspaces/components/WorksapceJoinView";
import { Workspace } from "@/modules/workspaces/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface WorkspaceJoinPageProps {
  params: Promise<{ inviteCode: string; workspaceId: string }>;
}
export default function WorkspaceJoinPage() {
  // const { inviteCode, workspaceId } = await params;
  const params = useParams();
  const { inviteCode, workspaceId } = params;
  const router = useRouter();

  const {
    data: workspace,
    isPending,
    error,
  } = useGetWorkspaceById(workspaceId as string);

  if (isPending && !workspace) {
    return <Loader />;
  }

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  if (error) {
    toast.error(error.message);
    router.push(`/workspaces/${workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl mx-auto">
      {workspace && <WorksapceJoinView workspace={workspace as Workspace} inviteCode={inviteCode as string} />}
    </div>
  );
}
