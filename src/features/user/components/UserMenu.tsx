import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/auth.hook";
import { useAuthStore } from "@/features/auth/auth.store";
import { LogOutIcon, User } from "lucide-react";
import { useNavigate } from "react-router";

export const UserMenu = () => {

    const { mutate: logout, isPending: isPendingLogout } = useLogout();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="rounded-lg">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                </Button>} />
            <DropdownMenuContent align="end" className="min-w-48 bg-background/10 backdrop-blur-sm">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-medium opacity-70 pt-2">
                        {user?.name || "Anonimous"}
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User />
                        Account
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    onClick={() => logout()}
                    disabled={isPendingLogout}
                >
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
