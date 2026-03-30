import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, id, name, ...props }, ref) => {

        const inputId = id || "name";

        return (
            <Field>
                <FieldLabel htmlFor={inputId} className="text-sm md:text-base">{label}</FieldLabel>
                <Input
                    id={inputId}
                    name={name}
                    ref={ref}
                    className="h-9 text-sm md:h-10 md:text-base"
                    {...props}
                />
                {error && <FieldError>{error}</FieldError>}
            </Field>
        )
    }
)

InputField.displayName = "InputField";