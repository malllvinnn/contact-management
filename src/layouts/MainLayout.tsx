import { ButtonField } from "@/components/form/ButtonField";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/auth.hook";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Outlet } from "react-router";

export const MainLayout = () => {

    const { mutate, isPending } = useLogout()
    const { setTheme } = useTheme();

    return (
        <>
            <h1>MainLayout</h1>

            {/* theme toggle button */}
            <DropdownMenu>
                <DropdownMenuTrigger render={
                    <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                } />
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* logout button */}
            <ButtonField
                orientation="horizontal"
                isPending={isPending}
                label="Logout"
                onClick={() => mutate()}
                className="cursor-pointer"
            />
            <main>
                <Outlet />
            </main>
        </>
    );
};
