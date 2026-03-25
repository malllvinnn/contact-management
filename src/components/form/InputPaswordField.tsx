import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOff } from "lucide-react";
import React from "react";
import { useToggle } from "react-use";

export interface InputPasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const InputPasswordField = React.forwardRef<HTMLInputElement, InputPasswordFieldProps>(
    ({ label, error, id, name, ...props }, ref) => {

        const inputId = id || name;
        const [showPassword, togglePassword] = useToggle(false);

        return (
            <Field>
                <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
                <InputGroup>
                    <InputGroupInput
                        id={inputId}
                        name={name}
                        type={showPassword ? "text" : "password"}
                        ref={ref}
                        {...props}
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton
                            type="button"
                            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                            size="icon-xs"
                            onClick={togglePassword}
                        >
                            {showPassword ? <EyeIcon /> : <EyeOff />}
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
                {error && <FieldError>{error}</FieldError>}
            </Field>
        )
    }
)

InputPasswordField.displayName = "InputPasswordField";