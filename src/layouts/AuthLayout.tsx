import { ThemeToggle } from "@/components/ThemeToggle";
import { Outlet, useLocation } from "react-router";
import { useAppStore } from "@/stores/app.store";
import { Button } from "@/components/ui/button";

export const AuthLayout = () => {

    const { openToggleForm, isOpenToggleForm } = useAppStore();
    const { pathname } = useLocation();

    const authLabel = pathname === "/auth/register" ? "Sign Up" : "Sign In";

    return (
        <>
            <nav className="flex items-center gap-2 sm:gap-3 absolute top-4 z-50 w-full justify-end px-6 md:px-8 lg:px-12 2xl:px-24">

                <ThemeToggle />

                {!isOpenToggleForm && (
                    <Button
                        variant="outline"
                        onClick={() => openToggleForm()}
                        className="hidden lg:flex rounded-lg px-6 cursor-pointer font-bold hover:scale-105 transition-transform"
                    >
                        {authLabel}
                    </Button>
                )}
            </nav>
            <main className="min-h-screen w-full max-w-full min-w-0 overflow-x-hidden flex flex-col lg:items-center lg:justify-center">
                <Outlet />
            </main>
        </>
    );
};
