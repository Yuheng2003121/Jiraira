import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Task, TaskStatus } from "../types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import KanbanColumnHeader from "./KanbanColumnHeader";
import KanbanCard from "./KanbanCard";
import { useUpdateTasks } from "../api/use-update-tasks";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DataKanbanProps {
  data: Task[];
  // onChange: (tasks:UpdatesPayload) => void;
}

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

type UpdatesPayload = {
  $id: string;
  status: TaskStatus;
  position: number;
}[];

export default function DataKanban({ data }: DataKanbanProps) {
  const { mutate: updateTasks, isPending: isPendingUpdate } = useUpdateTasks();
  const initializedTasks = useMemo(() => {
    const initialTasks: TasksState = {
      [TaskStatus.BACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialTasks[task.status].push(task);
    });

    Object.keys(initialTasks).forEach((status) => {
      initialTasks[status as TaskStatus].sort(
        (a, b) => a.position - b.position
      );
    });

    return initialTasks;
  }, [data]);

  const [tasks, setTasks] = useState<TasksState>(initializedTasks);
  useEffect(() => {
    setTasks(initializedTasks);
  }, [initializedTasks]);

  const queryClient = useQueryClient();
  const onChange = useCallback(
    (updatesPayload: UpdatesPayload) => {
      updateTasks(
        { json: { tasks: updatesPayload } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        }
      );
    },
    [updateTasks, queryClient]
  );

  //拖动逻辑
  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as TaskStatus;
    const destinationStatus = destination.droppableId as TaskStatus;

    let updatesPayload: UpdatesPayload = [];

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      //safely remove the task from the source column
      const sourceColumn = [...newTasks[sourceStatus]];
      const [movedTask] = sourceColumn.splice(source.index, 1);

      if (!movedTask) {
        console.log("No task founed at the source index");
        return prevTasks;
      }

      const updatedMovedTask =
        sourceStatus !== destinationStatus
          ? { ...movedTask, status: destinationStatus } //case when drag to different status
          : movedTask; //case when drag within the same status

      // update the source column
      newTasks[sourceStatus] = sourceColumn;

      //add the task to the destination column
      const destinationColumn = [...newTasks[destinationStatus]];
      destinationColumn.splice(destination.index, 0, updatedMovedTask);
      newTasks[destinationStatus] = destinationColumn;

      // prepare minimal update payloads
      updatesPayload = [];
      updatesPayload.push({
        $id: updatedMovedTask.$id,
        status: destinationStatus,
        position: Math.min((destination.index + 1) * 1000, 1_000_000),
      });

      newTasks[destinationStatus].forEach((task, index) => {
        if (task && task.$id !== updatedMovedTask.$id) {
          const newPosition = Math.min((index + 1) * 1000, 1_000_000);
          if (task.position !== newPosition) {
            updatesPayload.push({
              $id: task.$id,
              status: destinationStatus,
              position: newPosition,
            });
          }
        }
      });

      if (sourceStatus !== destinationStatus) {
        newTasks[sourceStatus].forEach((task, index) => {
          if (task) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.position !== newPosition) {
              updatesPayload.push({
                $id: task.$id,
                status: sourceStatus,
                position: newPosition,
              });
            }
          }
        });
      }

      return newTasks;
    });

    //更新数据库
    onChange(updatesPayload);
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-full flex gap-2 overflow-x-auto">
        {boards.map((board) => (
          <div
            key={board}
            className="h-full flex-1 bg-muted rounded-md min-w-50 shrink-0"
          >
            <div className="h-full flex flex-col">
              <div className="p-3">
                <KanbanColumnHeader
                  board={board}
                  taskCount={tasks[board].length}
                />
              </div>
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="px-3 flex-1 overflow-y-auto"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="my-2"
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
