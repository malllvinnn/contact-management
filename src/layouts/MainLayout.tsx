import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/auth.hook";
import { Loader } from "lucide-react";
import { Outlet } from "react-router";

export const MainLayout = () => {

    const { mutate, isPending } = useLogout();

    return (
        <div className="flex min-h-screen min-w-0 max-w-full flex-col overflow-x-hidden">
            <header className="sticky top-0 z-50 w-full max-w-full min-w-0 border-b border-border/50 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
                <nav
                    className="
                        mx-auto flex w-full max-w-full min-w-0
                        flex-wrap items-center justify-end gap-2 sm:gap-3
                        px-4 py-3 sm:px-6 md:px-8 lg:px-12 2xl:px-24
                    "
                    aria-label="Main navigation"
                >

                    <ThemeToggle />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => mutate()}
                        className="h-9 shrink-0 cursor-pointer text-sm md:h-10 md:text-base"
                    >
                        {isPending ? <Loader className="size-4 animate-spin" /> : "Logout"}
                    </Button>
                </nav>
            </header>

            <main className="w-full min-w-0 max-w-full flex-1">
                <Outlet />
            </main>

            <footer className="w-full min-w-0 border-t border-border px-4 py-4 text-center text-sm text-muted-foreground sm:px-6">
                <span>
                    &copy; {new Date().getFullYear()} Malfin. All rights reserved.
                </span>
            </footer>
        </div>
    );
};
