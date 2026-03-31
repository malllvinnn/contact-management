import { ButtonField } from "@/components/form/ButtonField";
import { InputField } from "@/components/form/InputField";
import { InputPasswordField } from "@/components/form/InputPaswordField";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdateUserSchema, type UpdateUserFormValues, type UpdateUserPayload } from "../user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetUser, useUpdateUser } from "../user.hook";
import { Skeleton } from "@/components/ui/skeleton";
export const UserForm = () => {

    const { data: userResponse, isLoading } = useGetUser();
    const { mutate, isPending } = useUpdateUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserFormValues>({
        resolver: zodResolver(UpdateUserSchema),
        defaultValues: {
            name: "",
            password: "",
            confirmPassword: "",
        }
    });

    useEffect(() => {
        if (userResponse?.data) {
            reset({
                name: userResponse.data.name,
                password: "",
                confirmPassword: "",
            });
        }
    }, [userResponse, reset]);

    const onSubmit = (values: UpdateUserFormValues) => {

        const payload: UpdateUserPayload = {};

        if (values.name?.trim()) payload.name = values.name.trim();
        if (values.password?.trim()) payload.password = values.password.trim();

        mutate(payload);
    };

    if (isLoading) {
        return (
            <div className="px-6 md:px-8 lg:px-12 2xl:px-24 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card px-6 py-4 rounded-lg">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-8 lg:px-12 2xl:px-24 py-6">

            <form onSubmit={handleSubmit(onSubmit)} className="bg-card px-6 py-4 rounded-lg space-y-2">

                <FieldSet className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* name & username */}
                    <FieldGroup>
                        <InputField
                            label="Username"
                            value={userResponse?.data.username ?? ""}
                            placeholder="Username"
                            disabled
                            readOnly
                        />
                        <InputField
                            label="Name"
                            placeholder="Enter your name"
                            error={errors.name?.message}
                            {...register("name")}
                        />
                    </FieldGroup>

                    {/* password */}
                    <FieldGroup>
                        <InputPasswordField
                            label="Password Baru"
                            placeholder="Kosongkan jika tidak ingin mengubah"
                            error={errors.password?.message}
                            {...register("password")}
                        />
                        <InputPasswordField
                            label="Konfirmasi Password"
                            placeholder="Ulangi password baru"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                    </FieldGroup>

                </FieldSet>

                <ButtonField
                    isPending={isPending}
                    orientation="horizontal"
                    label="Update Profile"
                    type="submit"
                    className="mt-4 cursor-pointer bg-secondary text-foreground hover:bg-red-400 hover:text-amber-50 dark:hover:bg-red-900"
                />
            </form>

        </div>
    );
};
