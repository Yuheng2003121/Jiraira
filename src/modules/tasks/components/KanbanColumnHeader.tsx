import React from "react";
import { TaskStatus } from "../types";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModalOpen } from "@/store/useCreateTaskModalOpen";
interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashedIcon className="size-4 text-pink-400" />,
  [TaskStatus.TODO]: <CircleIcon className="size-4 text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-4 text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleDotIcon className="size-4 text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheckIcon className="size-4 text-emerald-400" />,
};
export default function KanbanColumnHeader({
  board,
  taskCount,
}: KanbanColumnHeaderProps) {
  const icon = statusIconMap[board];
  const setIsOpen = useCreateTaskModalOpen((state) => state.setIsOpen);
  const setInitialStatus = useCreateTaskModalOpen(
    (state) => state.setInitialStatus
  );
  const handleClick = () => {
    setInitialStatus(board);
    setIsOpen(true);
    // setInitialStatus(null);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <span className="size-5 flex items-center justify-center rounded-md bg-neutral-200  text-sm font-medium">
          {taskCount}
        </span>
      </div>
      <Button
        onClick={handleClick}
        variant={"ghost"}
        size={"icon"}
        className="size-5 cursor-pointer"
      >
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
}
