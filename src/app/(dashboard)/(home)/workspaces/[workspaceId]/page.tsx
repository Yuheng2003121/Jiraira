import Navbar from "@/components/Navbar";
import React from "react";

interface WorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
}
export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspaceId } = await params;

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="p-6 flex-1">{workspaceId}</div>
    </div>
  );
}
