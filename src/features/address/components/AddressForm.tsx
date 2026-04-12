import { InputField } from "@/components/form/InputField";
import { ButtonField } from "@/components/form/ButtonField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAddressSchema, type CreateAddressPayload } from "../address.schema";
import { useCreateAddress } from "../address.hook";

const emptyValues: CreateAddressPayload = {
    street: "",
    city: "",
    province: "",
    country: "",
    postal_code: "",
};

interface AddressFormProps {
    contactId: string;
}

export const AddressForm = ({ contactId }: AddressFormProps) => {

    const { mutate, isPending } = useCreateAddress(contactId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateAddressPayload>({
        resolver: zodResolver(CreateAddressSchema),
        defaultValues: emptyValues,
    });

    const onSubmit = (values: CreateAddressPayload) => {
        mutate(values, {
            onSuccess: () => reset(emptyValues),
        });
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
                    label="Simpan Alamat"
                    className="cursor-pointer"
                />
            </div>
        </form>
    );
};
