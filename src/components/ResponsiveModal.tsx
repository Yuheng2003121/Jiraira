"use client"
import { useMedia } from "react-use";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ResponsiveModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function ResponsiveModal({
  children,
  isOpen,
  onOpenChange,
}: ResponsiveModalProps) {
  const isDesktop = useMedia("(min-width: 1025px)", true);

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTitle className="hidden">create</DialogTitle>
        <DialogContent className="sm:max-w-lg overflow-y-auto hide-scrollbar max-h-[85vh] p-4">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  //mobile
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTitle className="hidden">create</DrawerTitle>
      <DrawerContent>
        <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
