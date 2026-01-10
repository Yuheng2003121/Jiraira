import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/modules/members/api/use-get-members';
import { useGetProjects } from '@/modules/projects/api/use-get-projects';
import { Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react'
import CreateTaskForm from './CreateTaskForm';

interface CreateTasksFormWrapperProps {
  onCancel: () => void;
}
export default function CreateTasksFormWrapper({onCancel}: CreateTasksFormWrapperProps) {
  const workspaceId = useParams();
  const {data: projects, isPending:isPendingProjects} = useGetProjects({workspaceId: workspaceId.workspaceId as string})
  const {data: members, isPending:isPendingMembers} = useGetMembers({workspaceId: workspaceId.workspaceId as string})

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl
  }))

  const memberOptions = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }))

  const isPending = isPendingMembers || isPendingProjects;

  if (isPending) {
    return (
      <Card className='h-178 '>
        <CardContent className='h-full flex items-center justify-center'>
          <Loader className='size-5 animate-spin text-muted-foreground'/>
        </CardContent>
      </Card>
    )
  }


  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions || []}
      memberOptions={memberOptions || []}
    />
  );
}
