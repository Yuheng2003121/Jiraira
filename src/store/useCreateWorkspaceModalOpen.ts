import { create } from "zustand";

type CounterStore = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useCreateWorkspaceModalOpen = create<CounterStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
}));
