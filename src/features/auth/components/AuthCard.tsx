import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthCardProps {
    title: string;
    descTo: string;
    children: ReactNode;
}

export const AuthCard = ({
    title,
    descTo,
    children
}: AuthCardProps) => {

    return (
        <div className="border-red-400 border flex justify-center gap-6">
            <div className="border">
                <div>
                    <h1>{title}</h1>
                    <div>
                        <span>{descTo}</span>
                        <span>
                            <Link to={"auth/login"}>Login</Link>
                        </span>
                    </div>
                </div>
                <div>
                    {children}
                </div>
            </div>
            <div>
                <h1>Ini Images</h1>
            </div>
        </div>
    );
};
