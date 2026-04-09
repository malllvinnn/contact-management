import { InputField } from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import {
    CreateContactSchema,
    UpdateContactSchema,
    type CreateContactPayload,
    type UpdateContactPayload,
} from "../contact.schema";
import { useCreateContact, useUpdateContact } from "../contact.hook";
import type { Contact } from "../contact.types";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact as ContactIcon, Loader } from "lucide-react";
import { useEffect } from "react";

const emptyValues: CreateContactPayload = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
};

export interface ContactFormProps {
    mode: "create" | "edit";
    defaultValues?: Contact;
}

export const ContactForm = ({ mode, defaultValues }: ContactFormProps) => {

    const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateContact();

    const updateId = mode === "edit" && defaultValues?.id ? defaultValues.id : "";
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateContact(updateId);

    const resolver = (
        mode === "create"
            ? zodResolver(CreateContactSchema)
            : zodResolver(UpdateContactSchema)
    ) as Resolver<CreateContactPayload>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateContactPayload>({
        resolver,
        defaultValues: emptyValues,
    });

    useEffect(() => {
        if (mode !== "edit" || !defaultValues) return;
        reset({
            first_name: defaultValues.first_name,
            last_name: defaultValues.last_name ?? "",
            email: defaultValues.email ?? "",
            phone: defaultValues.phone ?? "",
        });
    }, [mode, defaultValues, reset]);

    const onSubmit = (values: CreateContactPayload) => {
        if (mode === "create") {
            mutateCreate(values, {
                onSuccess: () => reset(emptyValues),
            });
            return;
        }

        if (!defaultValues?.id) return;

        const payload: UpdateContactPayload = {
            first_name: values.first_name,
            last_name: values.last_name === "" ? undefined : values.last_name,
            email: values.email === "" ? undefined : values.email,
            phone: values.phone === "" ? undefined : values.phone,
        };

        mutateUpdate(payload);
    };

    const isPending = mode === "create" ? isPendingCreate : isPendingUpdate;
    const title = mode === "create" ? "Create Contact" : "Edit Contact";
    const submitLabel = mode === "create" ? "Create Contact" : "Save changes";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <DialogHeader className="flex flex-col gap-4 pb-4">

                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <ContactIcon />
                    {title}
                </DialogTitle>

                <FieldSet className="w-full">
                    <FieldGroup>
                        <InputField
                            label="First Name"
                            placeholder="Enter First Name"
                            error={errors.first_name?.message}
                            {...register("first_name")}
                        />
                        <InputField
                            label="Last Name"
                            placeholder="Enter Last Name"
                            error={errors.last_name?.message}
                            {...register("last_name")}
                        />
                        <InputField
                            label="Email"
                            placeholder="Enter Email"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <InputField
                            label="Phone"
                            placeholder="Enter Phone"
                            error={errors.phone?.message}
                            {...register("phone")}
                        />
                    </FieldGroup>
                </FieldSet>
            </DialogHeader>
            <DialogFooter>

                <DialogClose render={<Button variant="outline" className="cursor-pointer" />}>Cancel</DialogClose>

                <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                    {isPending ? <Loader className="animate-spin" /> : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
};
