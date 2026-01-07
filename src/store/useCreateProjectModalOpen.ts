import { create } from "zustand";

type CounterStore = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const useCreateProjectModalOpen = create<CounterStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
}));
