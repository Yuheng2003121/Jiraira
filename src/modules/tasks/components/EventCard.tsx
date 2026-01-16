import { Project } from '@/modules/projects/types';
import React from 'react'
import { TaskStatus } from '../types';
import { cn } from '@/lib/utils';
import MemberAvatar from '@/modules/members/components/MemberAvatar';
import ProjectAvatar from '@/modules/projects/components/ProjectAvatar';
import { useParams, useRouter } from 'next/navigation';

interface EventCardProps {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignee: any;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: "border-l-pink-500",
  [TaskStatus.TODO]: "border-l-red-500",
  [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
  [TaskStatus.IN_REVIEW]: "border-l-blue-500",
  [TaskStatus.DONE]: "border-l-emerald-500",
};
export default function EventCard({  title, assignee, project, status, id }: EventCardProps) {
  const {workspaceId} = useParams();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  }

  return (
    <div className="px-2" onClick={onClick}>
      <div
        className={cn(
          "p-1.5 text-xs big-white text-primary border border-l-4 rounded-md flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className='flex items-center gap-1'>
          <MemberAvatar
            name={assignee?.name}
          />
          <div className='size-1 rounded-full bg-neutral-300'/>
          <ProjectAvatar
            name={project?.name}
            image={project?.imageUrl}
          />

        </div>
      </div>
    </div>
  );
}
