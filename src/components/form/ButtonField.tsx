import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Loader } from "lucide-react";
import React from "react";

interface ButtonFieldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isPending: boolean;
    label: string;
    orientation?: "responsive" | "horizontal" | "vertical";
}

export const ButtonField = React.forwardRef<HTMLButtonElement, ButtonFieldProps>(
    ({ isPending, label, orientation = "responsive", ...props }, ref) => {
        return (
            <Field orientation={orientation}>
                <Button
                    ref={ref}
                    disabled={isPending}
                    {...props}
                >
                    {isPending ? <Loader className="animate-spin" /> : label}
                </Button>
            </Field>
        );
    }
)

ButtonField.displayName = "ButtonField";