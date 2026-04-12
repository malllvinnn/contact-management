import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { AppButton } from "./AppButton";
import { useMatch, useNavigate } from "react-router";
import { ContactModal } from "@/features/contact/components/ContactModal";

interface TitleBarProps {
    title: string;
    icon?: LucideIcon;
    backButton?: boolean;
}

export const TitleBar = ({
    title,
    icon: Icon,
    backButton = false,
}: TitleBarProps) => {

    const navigate = useNavigate();
    const isContactDetailRoute = Boolean(useMatch("/dashboard/contacts/:id"));
    const showCreateTrigger = !isContactDetailRoute;

    return (
        <div className="px-6 md:px-8 lg:px-12 2xl:px-24 flex items-center gap-2 py-2 heading-2 justify-between bg-card">

            {backButton ? (
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <AppButton
                        label="Back"
                        icon={<ArrowLeft strokeWidth={3.5} size={32} className="text-foreground" />}
                        onClick={() => navigate(-1)}
                    />
                    <ContactModal showCreateTrigger={showCreateTrigger} />
                </div>
            ) : (
                <ContactModal showCreateTrigger={showCreateTrigger} />
            )}

            <div className="flex items-center gap-2">
                {Icon && <Icon strokeWidth={2.5} size={32} className="text-secondary" />}
                <h1 className="font-bold opacity-50 text-base md:text-lg lg:text-xl 2xl:text-2xl">{title}</h1>
            </div>
        </div>
    );
};
