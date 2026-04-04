import type { ContactState } from "./contact.types";
import { create } from "zustand";

export const useContactStore = create<ContactState>()((set) => ({
    isOpenCreateModal: false,
    openCreateModal: () => set({ isOpenCreateModal: true }),
    closeCreateModal: () => set({ isOpenCreateModal: false }),
}));
