import { create } from "zustand";

interface Props {
  editProductOpen: boolean;
  editProductData: any;
  setEditProductOpen: (newState: boolean) => void;
  setEditProductData: (newState: any) => void;
  editProductOnOpen: () => void;
  editProductOnClose: () => void;
}

const useEditProductDisclosure = create<Props>((set) => ({
  editProductOpen: false,
  editProductData: null,
  setEditProductOpen: (newState) => set({ editProductOpen: newState }),
  setEditProductData: (newState) => set({ editProductData: newState }),
  editProductOnOpen: () => set({ editProductOpen: true }),
  editProductOnClose: () => set({ editProductOpen: false }),
}));

export default useEditProductDisclosure;
