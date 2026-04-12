import { InputField } from "@/components/form/InputField";
import { ButtonField } from "@/components/form/ButtonField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAddressSchema, type CreateAddressPayload } from "../address.schema";
import { useCreateAddress, useUpdateAddress } from "../address.hook";
import type { Address } from "../address.types";
import { useEffect } from "react";

const emptyValues: CreateAddressPayload = {
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
};

interface AddressFormProps {
    contactId: string;
    mode?: "create" | "edit";
    defaultValues?: Address;
    addressId?: string;
}

export const AddressForm = ({ contactId, mode = "create", defaultValues, addressId }: AddressFormProps) => {

    const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateAddress(contactId);
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateAddress(contactId, addressId ?? "");

    const isPending = mode === "create" ? isPendingCreate : isPendingUpdate;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateAddressPayload>({
        resolver: zodResolver(CreateAddressSchema),
        defaultValues: emptyValues,
    });

    useEffect(() => {
        if (mode !== "edit" || !defaultValues) return;
        reset({
            street: defaultValues.street ?? "",
            city: defaultValues.city ?? "",
            province: defaultValues.province ?? "",
            country: defaultValues.country,
            postal_code: defaultValues.postal_code,
        });
    }, [mode, defaultValues, reset]);

    const onSubmit = (values: CreateAddressPayload) => {
        if (mode === "create") {
            mutateCreate(values, {
                onSuccess: () => reset(emptyValues),
            });
            return;
        }
        mutateUpdate(values);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InputField
                    label="Street"
                    placeholder="Nama jalan"
                    error={errors.street?.message}
                    disabled={isPending}
                    {...register("street")}
                />
                <InputField
                    label="City"
                    placeholder="Kota"
                    error={errors.city?.message}
                    disabled={isPending}
                    {...register("city")}
                />
                <InputField
                    label="Province"
                    placeholder="Provinsi"
                    error={errors.province?.message}
                    disabled={isPending}
                    {...register("province")}
                />
                <InputField
                    label="Country"
                    placeholder="Negara"
                    error={errors.country?.message}
                    disabled={isPending}
                    {...register("country")}
                />
                <InputField
                    label="Postal Code"
                    placeholder="Kode pos"
                    error={errors.postal_code?.message}
                    disabled={isPending}
                    {...register("postal_code")}
                />
            </div>

            <div className="flex justify-end">
                <ButtonField
                    type="submit"
                    isPending={isPending}
                    label={mode === "create" ? "Simpan Alamat" : "Update Alamat"}
                    className="cursor-pointer"
                />
            </div>
        </form>
    );
};
