import { FieldGroup, FieldSet } from "@/components/ui/field";
import { useRegister } from "../auth.hook";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormValues } from "../auth.schema";
import { InputField } from "@/components/form/InputField";
import { InputPasswordField } from "@/components/form/InputPaswordField";
import { ButtonField } from "@/components/form/ButtonField";

export const RegisterForm = () => {

    const { mutate, isPending } = useRegister();

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

        const { confirmPassword: _, ...apiPayload } = values;

        mutate(apiPayload);
    };

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

                    {/* input name */}
                    <InputField
                        label="Name"
                        placeholder="Enter Name"
                        error={errors.name?.message}
                        {...register("name")}
                    />

                    {/* input password */}
                    <InputPasswordField
                        label="Password"
                        placeholder="Enter Password"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    {/* input confirm password */}
                    <InputPasswordField
                        label="Confirm Password"
                        placeholder="Enter Password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    {/* button submit */}
                    <ButtonField
                        isPending={isPending}
                        label="Register"
                        orientation="responsive"
                        type="submit"
                        className="cursor-pointer bg-secondary text-foreground hover:bg-red-400 hover:text-amber-50 dark:hover:bg-red-900"
                    />
                </FieldGroup>
            </FieldSet>
        </form>
    );
};
