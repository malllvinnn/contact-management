import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../auth.hook";
import { LoginPayloadSchema, type LoginPayload } from "../auth.schema";
import { useForm } from "react-hook-form";
import { InputField } from "@/components/form/InputField";
import { InputPasswordField } from "@/components/form/InputPaswordField";
import { ButtonField } from "@/components/form/ButtonField";
import { FieldGroup, FieldSet } from "@/components/ui/field";

export const LoginForm = () => {

    const { mutate, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPayload>({
        resolver: zodResolver(LoginPayloadSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

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
                        label="Login"
                        orientation="responsive"
                        type="submit"
                        className="cursor-pointer"
                    />
                </FieldGroup>
            </FieldSet>
        </form>
    );
};
