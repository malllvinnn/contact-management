import type { ButtonProps } from "@base-ui/react/button";
import { Button } from "./ui/button";

interface AppButtonProps extends ButtonProps {
    label: string;
    icon?: React.ReactNode;
    className?: string;
}

export const AppButton = ({
    label,
    icon,
    className,
    ...props
}: AppButtonProps) => {
    return (
        <Button
            className={`
                    h-9 text-sm md:h-10 md:text-base cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-secondary dark:bg-foreground/5 border border-foreground/10 bg-transparent
                    ${className}
                `}
            {...props}
        >
            {icon && icon}
            <span className="text-foreground">
                {label}
            </span>
        </Button>
    );
};
