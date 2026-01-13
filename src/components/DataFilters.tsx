import { useGetMembers } from "@/modules/members/api/use-get-members";
import { useGetProjects } from "@/modules/projects/api/use-get-projects";
import { useParams } from "next/navigation";
import React from "react";
interface DataFiltersProps {
  hideProjectFilter?: boolean;
}
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "@/modules/tasks/types";
import { useTaskFilter } from "@/hooks/useTaskFilter";
import { DatePicker } from "./DatePicker";

export default function DataFilters({ hideProjectFilter }: DataFiltersProps) {
  const { workspaceId } = useParams();

  const { data: projects, isPending: isPendingProjects } = useGetProjects({
    workspaceId: workspaceId as string,
  });
  const { data: members, isPending: isPendingMembers } = useGetMembers({
    workspaceId: workspaceId as string,
  });

  const [{ status, assigneeId, dueDate, search, projectId }, setFilter] =
    useTaskFilter();

  const isPending = isPendingMembers || isPendingProjects;

  const onStatusChange = (value: string) => {
    setFilter({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilter({ assigneeId: value === "all" ? null : value });
  };

  const onProjectChange = (value: string) => {
    setFilter({ projectId: value === "all" ? null : value });
  };

  const onDueDateChange = (value: Date | null) => {
    const dateString = value ? value.toISOString() : null;
    setFilter({ dueDate: dateString });
  };

  if (isPending) {
    return null;
  }

  const projectOptions = projects?.documents?.map((project) => ({
    label: project.name,
    value: project.$id,
  }));

  const memberOptions = members?.documents?.map((member) => ({
    label: member.name,
    value: member.$id,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status || undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto focus-visible:ring-0 ">
          <div className="flex items-center">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All status" />
          </div>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={assigneeId || undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto focus-visible:ring-0 ">
          <div className="flex items-center">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All assignees</SelectItem>
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={projectId || undefined}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-full lg:w-auto focus-visible:ring-0 ">
          <div className="flex items-center">
            <FolderIcon className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All projects</SelectItem>
          {projectOptions?.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>


      <div>
        <DatePicker
          onDateSelect={onDueDateChange}
          defaultDate={dueDate ? new Date(dueDate) : undefined}
        />
      </div>
    </div>
  );
}
