import { create } from "zustand";

interface SignupModalType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSignupModal = create<SignupModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSignupModal;
