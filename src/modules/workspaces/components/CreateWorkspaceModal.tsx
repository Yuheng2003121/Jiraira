"use client";
// import ResponsiveModal from "@/components/ResponsiveModal";
import CreateWorkspaceForm from "./CreateWorkspaceForm";
import { useCreateModalOpen } from "@/store/useCreateModalOpen";
import dynamic from "next/dynamic";

const ResponsiveModal = dynamic(() => import("@/components/ResponsiveModal"), {
  ssr: false,
});

export default function CreateWorkspaceModal() {
 const isOpen = useCreateModalOpen((state) => state.isOpen);
 const setIsOpen = useCreateModalOpen((state) => state.setIsOpen);

  return (
    <ResponsiveModal isOpen={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={() => setIsOpen(false)} />
    </ResponsiveModal>
  );
}
