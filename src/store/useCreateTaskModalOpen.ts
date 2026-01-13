import { TaskStatus } from "@/modules/tasks/types";
import { create } from "zustand";

type CounterStore = {
  isOpen: boolean;
  initialStatus: TaskStatus | null;
  setIsOpen: (open: boolean) => void;
  setInitialStatus: (status: TaskStatus | null) => void;
};

export const useCreateTaskModalOpen = create<CounterStore>((set) => ({
  isOpen: false,
  initialStatus: null,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  setInitialStatus: (status) => set(() => ({ initialStatus: status })),
}));
