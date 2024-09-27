import { create } from "zustand";

interface AddTaskModalType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAddTaskModal = create<AddTaskModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useAddTaskModal;
