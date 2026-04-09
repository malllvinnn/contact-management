import { TitleBar } from "@/components/TitleBar";
import type { LucideIcon } from "lucide-react";

interface ContactContainerProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    backButton?: boolean;
}

export const ContactContainer = ({
    title,
    icon,
    children,
    backButton = false
}: ContactContainerProps) => {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <TitleBar title={title} icon={icon} backButton={backButton} />
            <div className="flex min-h-0 flex-1 flex-col px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                {children}
            </div>
        </div>
    );
};
