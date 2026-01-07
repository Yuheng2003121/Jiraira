"use client";
import { useCreateProjectModalOpen } from "@/store/useCreateProjectModalOpen";
import dynamic from "next/dynamic";
import CreateProjectForm from "./CreateProjectForm";

const ResponsiveModal = dynamic(() => import("@/components/ResponsiveModal"), {
  ssr: false,
});

export default function CreateProjectModal() {
  const isOpen = useCreateProjectModalOpen((state) => state.isOpen);
  const setIsOpen = useCreateProjectModalOpen((state) => state.setIsOpen);

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={() => setIsOpen(false)} />
    </ResponsiveModal>
  );
}
