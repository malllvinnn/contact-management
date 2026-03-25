import type { ReactNode } from "react";
import { Link } from "react-router";

interface AuthCardProps {
    title: string;
    descTo: string;
    children: ReactNode;
    to: string;
    descLink: string;
}

export const AuthCard = ({
    title,
    descTo,
    to,
    descLink,
    children,
}: AuthCardProps) => {

    return (
        <div className="border-red-400 border flex justify-center gap-6">
            <div className="border">
                <div>
                    <h1>{title}</h1>
                    <div>
                        <span>{descTo}</span>
                        <span>
                            <Link to={to}>{descLink}</Link>
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
