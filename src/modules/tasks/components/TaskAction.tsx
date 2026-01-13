"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useConfirm from "@/hooks/use-confirm";
import { useParams, useRouter } from "next/navigation";
import { useEditTaskModalOpen } from "@/store/useEditTaskModalOpen";
import EditTaskModal from "./EditTaskModal";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}
export default function TaskAction({
  id,
  projectId,
  children,
}: TaskActionProps) {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const queryClient = useQueryClient();
  const router = useRouter();
  const {workspaceId} = useParams();
  const setTask = useEditTaskModalOpen((state) => state.setTask);


  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "This action cannot be undone.",
    "destructive"
  );

  const onOpenTask = () => {
    router.push(`workspaces/${workspaceId}/tasks/${id}`)
  }

  const onOpenProject = () => {
    router.push(`workspaces/${workspaceId}/projects/${projectId}`)
  }

  const handleDelete = async () => {
    const isConfirm = await confirm();
    if (!isConfirm) return;
    deleteTask(
      { param: { taskId: id } },
      {
        onSuccess: (data) => {
          toast.success("Task deleted successfully");
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleEdit = () => {
    setTask(id);
  }

  const isPending = isDeleting;

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <EditTaskModal />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="pr-4">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="font-medium p-2"
          >
            <ExternalLinkIcon className="size-4 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleEdit}
            disabled={false}
            className="font-medium p-2"
          >
            <PencilIcon className="size-4 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isPending}
            className="font-medium p-2 text-amber-700 focus:text-amber-700"
          >
            <TrashIcon className="size-4 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
