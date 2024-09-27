import { create } from "zustand";

interface SignInModalType {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSignInModal = create<SignInModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSignInModal;
