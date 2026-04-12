import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "@/features/auth/auth.types";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            hasHydrated: false,
            setAuth: (token, user) => set({ token, user }),
            clearAuth: () => set({ token: null, user: null }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
            updateUser: (partial) => set((state) => ({
                user: state.user ? { ...state.user, ...partial } : state.user,
            })),
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)