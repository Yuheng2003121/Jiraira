import React from 'react'

interface WorkspacePageProps {
  params: Promise<{workspaceId: string}>
}
export default async function WorkspacePage({params}: WorkspacePageProps) {
  const {workspaceId} = await params;

  return <div>{workspaceId}</div>;
}
