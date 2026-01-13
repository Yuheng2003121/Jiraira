"use client";
import dynamic from "next/dynamic";
import { useCreateTaskModalOpen } from "@/store/useCreateTaskModalOpen";
import CreateTaskForm from "./CreateTaskForm";
import CreateTasksFormWrapper from "./CreateTasksFormWrapper";

const ResponsiveModal = dynamic(() => import("@/components/ResponsiveModal"), {
  ssr: false,
});

export default function CreateTaskModal() {
  const isOpen = useCreateTaskModalOpen((state) => state.isOpen);
  const setIsOpen = useCreateTaskModalOpen((state) => state.setIsOpen);
  const setInitialStatus = useCreateTaskModalOpen(
      (state) => state.setInitialStatus
  );

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={() => {
      setIsOpen(false);
      setInitialStatus(null);
    }}>
      {/* <CreateTaskForm onCancel={() => setIsOpen(false)} /> */}
      <CreateTasksFormWrapper onCancel={() => setIsOpen(false)} />
    </ResponsiveModal>
  );
}
