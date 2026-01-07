"use client";
// import ResponsiveModal from "@/components/ResponsiveModal";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { useCreateWorkspaceModalOpen } from "@/store/useCreateWorkspaceModalOpen";
import dynamic from "next/dynamic";

const ResponsiveModal = dynamic(() => import("@/components/ResponsiveModal"), {
  ssr: false,
});

export default function CreateWorkspaceModal() {
  const isOpen = useCreateWorkspaceModalOpen((state) => state.isOpen);
  const setIsOpen = useCreateWorkspaceModalOpen((state) => state.setIsOpen);

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={() => setIsOpen(false)} />
    </ResponsiveModal>
  );
}
