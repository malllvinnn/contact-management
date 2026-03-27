/**
 * Theme store — read-only mirror dari next-themes.
 * next-themes tetap sebagai sumber kebenaran (localStorage + DOM).
 * Store ini hanya untuk konsumsi lintas fitur tanpa prop drilling.
 *
 * Cara sync: panggil syncTheme() dari komponen yang sudah punya akses useTheme(),
 * biasanya di ThemeProvider atau layout root.
 */

import { create } from "zustand";

type Theme = "light" | "dark" | "system";

type ThemeState = {
    theme: Theme;
    resolvedTheme: "light" | "dark" | undefined;
    syncTheme: (theme: Theme, resolvedTheme: "light" | "dark" | undefined) => void;
};

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: "system",
    resolvedTheme: undefined,
    syncTheme: (theme, resolvedTheme) => set({ theme, resolvedTheme }),
}));
