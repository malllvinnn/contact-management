import type { AppState } from "@/types/app-state.types";
import { create } from "zustand";

export const useAppStore = create<AppState>()((set) => ({
    isOpenToggleForm: false,
    openToggleForm: () => set({ isOpenToggleForm: true }),
    closeToggleForm: () => set({ isOpenToggleForm: false }),
    toggleForm: () => set((state) => ({ isOpenToggleForm: !state.isOpenToggleForm })),
}));
