import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useThemeStore } from "@/stores/theme.store";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
};

function ThemeSyncer() {
  const { theme, resolvedTheme } = useTheme();
  const syncTheme = useThemeStore((s) => s.syncTheme);

  useEffect(() => {
    syncTheme(
      (theme ?? "system") as "light" | "dark" | "system",
      resolvedTheme as "light" | "dark" | undefined
    );
  }, [theme, resolvedTheme, syncTheme]);

  return null;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "app-theme",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
    >
      <ThemeSyncer />
      {children}
    </NextThemesProvider>
  );
}
