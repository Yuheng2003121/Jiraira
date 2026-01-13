import { create } from "zustand";

// type CounterStore = {
//   isOpen: boolean;
//   setIsOpen: (open: boolean) => void;
// };

// export const useEditTaskModalOpen = create<CounterStore>((set) => ({
//   isOpen: false,
//   setIsOpen: (isOpen) => set(() => ({ isOpen })),
// }));

type CounterStore = {
  editTaskId: string | null;
  setTask: (taskId: string | null) => void;
};

export const useEditTaskModalOpen = create<CounterStore>((set) => ({
  editTaskId: null,
  setTask: (taskId) => set(() => ({ editTaskId: taskId })),
}));
