import { create } from "zustand";
import type { AddressState } from "./address.types";

export const useAddressStore = create<AddressState>()((set) => ({
    isOpenCreateModal: false,
    openCreateModal: () => set({ isOpenCreateModal: true }),
    closeCreateModal: () => set({ isOpenCreateModal: false }),

    isOpenEditModal: false,
    selectedAddress: null,
    openEditModal: (address) => set({ isOpenEditModal: true, selectedAddress: address }),
    closeEditModal: () => set({ isOpenEditModal: false, selectedAddress: null }),
}));
