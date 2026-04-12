import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useLogin } from "../auth.hook";
import { LoginPayloadSchema, type LoginPayload } from "../auth.schema";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/form/InputField";
import { InputPasswordField } from "@/components/form/InputPaswordField";
import { ButtonField } from "@/components/form/ButtonField";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { useAppStore } from "@/stores/app.store";

export const LoginForm = () => {

    const { mutate, isPending } = useLogin();
    const isOpenToggleForm = useAppStore((s) => s.isOpenToggleForm);

    const {
        register,
        setFocus,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPayload>({
        resolver: zodResolver(LoginPayloadSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    useEffect(() => {
        if (!isOpenToggleForm) return;
        const id = requestAnimationFrame(() => setFocus("username"));
        return () => cancelAnimationFrame(id);
    }, [isOpenToggleForm, setFocus]);

    const onSubmit = (values: LoginPayload) => mutate(values);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldGroup>

                    {/* input username */}
                    <InputField
                        label="Username"
                        placeholder="Enter Username"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    {/* input password */}
                    <InputPasswordField
                        label="Password"
                        placeholder="Enter Password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    {/* button submit */}
                    <ButtonField
                        isPending={isPending}
                        label="Sign In"
                        orientation="responsive"
                        type="submit"
                        className="cursor-pointer bg-secondary text-foreground hover:bg-red-400 hover:text-amber-50 dark:hover:bg-red-900"
                    />
                </FieldGroup>
            </FieldSet>
        </form>
    );
};
