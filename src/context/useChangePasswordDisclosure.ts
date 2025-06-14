import { create } from "zustand";

interface Props {
  changePasswordOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  setChangePasswordOpen: (newState: boolean) => void;
}

const useChangePasswordDisclosure = create<Props>((set) => ({
  changePasswordOpen: false,
  onOpen: () => set({ changePasswordOpen: true }),
  onClose: () => set({ changePasswordOpen: false }),
  setChangePasswordOpen: (newState) => set({ changePasswordOpen: newState }),
}));

export default useChangePasswordDisclosure;
