import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister } from "../auth.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormValues } from "../auth.schema";
import { EyeIcon, EyeOff, Loader } from "lucide-react";
import { useToggle } from "react-use";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export const RegisterForm = () => {

    const { mutate, isPending } = useRegister();
    const [showPassword, togglePassword] = useToggle(false);
    const [showConfirmPassword, toggleConfirmPassword] = useToggle(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: "",
            name: "",
            password: "",
            confirmPassword: "",
        }
    });

    const onSubmit = (values: RegisterFormValues) => {

        const { confirmPassword: _confirmPassword, ...apiPayload } = values;

        mutate(apiPayload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username"
                            {...register("username")}
                        />
                        <FieldError>{errors.username?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter Name"
                            {...register("name")}
                        />
                        <FieldError>{errors.name?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password")}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    type="button"
                                    aria-label="Copy"
                                    title="Copy"
                                    size="icon-xs"
                                    onClick={togglePassword}
                                >
                                    {showPassword ? <EyeIcon /> : <EyeOff />}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.password?.message}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register("confirmPassword")}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton
                                    type="button"
                                    aria-label="Copy"
                                    title="Copy"
                                    size="icon-xs"
                                    onClick={toggleConfirmPassword}
                                >
                                    {showConfirmPassword ? <EyeIcon /> : <EyeOff />}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        <FieldError>{errors.confirmPassword?.message}</FieldError>
                    </Field>
                    <Field orientation="horizontal">
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="cursor-pointer"
                        >
                            {isPending ? <Loader className="animate-spin" /> : "Register"}
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
};
