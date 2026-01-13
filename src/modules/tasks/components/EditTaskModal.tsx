"use client";
import dynamic from "next/dynamic";
import { useEditTaskModalOpen } from "@/store/useEditTaskModalOpen";
import EditTasksFormWrapper from "./EditTasksFormWrapper";

const ResponsiveModal = dynamic(() => import("@/components/ResponsiveModal"), {
  ssr: false,
});

export default function EditTaskModal() {
  // const isOpen = useCreateTaskModalOpen((state) => state.isOpen);
  // const setIsOpen = useCreateTaskModalOpen((state) => state.setIsOpen);
  const editTaskId = useEditTaskModalOpen((state) => state.editTaskId);
  const setTask = useEditTaskModalOpen((state) => state.setTask);

  return (
    <ResponsiveModal isOpen={!!editTaskId} onOpenChange={() => setTask(null)}>
      {/* <CreateTaskForm onCancel={() => setIsOpen(false)} /> */}
      {editTaskId && (
        <EditTasksFormWrapper id={editTaskId} onCancel={() => setTask(null)} />
      )}
    </ResponsiveModal>
  );
}
