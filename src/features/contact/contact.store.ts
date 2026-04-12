import type { ContactState } from "./contact.types";
import { create } from "zustand";

export const useContactStore = create<ContactState>()((set) => ({
    // create store
    isOpenCreateModal: false,
    openCreateModal: () => set({ isOpenCreateModal: true }),
    closeCreateModal: () => set({ isOpenCreateModal: false }),

    // edit store
    isOpenEditModal: false,
    selectedContact: null,
    openEditModal: (contact) => set({ isOpenEditModal: true, selectedContact: contact }),
    closeEditModal: () => set({ isOpenEditModal: false, selectedContact: null }),
}));
