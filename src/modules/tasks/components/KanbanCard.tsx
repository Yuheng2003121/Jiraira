import React from "react";
import { Task } from "../types";
import TaskAction from "./TaskAction";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import DottedSeparator from "@/components/DottedSeparator";
import MemberAvatar from "@/modules/members/components/MemberAvatar";
import TaskDate from "@/components/TaskDate";
import ProjectAvatar from "@/modules/projects/components/ProjectAvatar";
interface KanbanCardProps {
  task: Task;
}
export default function KanbanCard({ task }: KanbanCardProps) {
  return (
    <div className="bg-white p-3 rounded-md shadow-sm flex flex-col gap-2.5">
      <div className="flex justify-between">
        <p className="text-sm line-clamp-2 gap-2">{task.name}</p>
        <TaskAction id={task.$id} projectId={task.projectId}>
          <Button className="size-5 cursor-pointer" variant={"ghost"}>
            <MoreHorizontal className="size-4" />
          </Button>
        </TaskAction>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-2">
        <MemberAvatar
          name={task.assignee!.name!}
          fallbackClassName="text-[10px]"
        />
        <TaskDate  date={task.dueDate} className="text-xs"/>
      </div>
      <div className="flex items-center gap-2">
        <ProjectAvatar
          name={task.project!.name!}
          image={task.project!.imageUrl}
          className="text-[10px] size-5"
        />
        <span className="text-xs font-medium">{task.project?.name}</span>
      </div>
    </div>
  );
}
