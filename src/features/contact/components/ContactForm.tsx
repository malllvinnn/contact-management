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
import { useCreateContact, useGetContact, useUpdateContact } from "../contact.hook";
import { useContactStore } from "../contact.store";
import type { Contact } from "../contact.types";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact as ContactIcon, Loader, Pencil } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ContactDetailFieldSkeleton } from "./ContactDetailFieldSkeleton";

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

    const closeEditModal = useContactStore((s) => s.closeEditModal);
    const { mutate: mutateCreate, isPending: isPendingCreate } = useCreateContact();

    const updateId = mode === "edit" && defaultValues?.id ? defaultValues.id : "";
    const { mutate: mutateUpdate, isPending: isPendingUpdate } = useUpdateContact(updateId);

    const {
        data: contactResponse,
        isPending: isContactFetchPending,
        isError: isContactFetchError,
    } = useGetContact(updateId);

    const showPrefillSkeleton =
        mode === "edit" &&
        !!updateId &&
        isContactFetchPending &&
        !contactResponse;

    const resolver = (
        mode === "create"
            ? zodResolver(CreateContactSchema)
            : zodResolver(UpdateContactSchema)
    ) as Resolver<CreateContactPayload>;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<CreateContactPayload>({
        resolver,
        defaultValues: emptyValues,
    });

    const prefillSource = useMemo((): Contact | null => {
        if (mode !== "edit") return null;
        const fromApi = contactResponse?.data;
        if (fromApi) return fromApi;
        if (isContactFetchError && defaultValues) return defaultValues;
        if (!isContactFetchPending && defaultValues) return defaultValues;
        return null;
    }, [
        mode,
        contactResponse?.data,
        isContactFetchError,
        isContactFetchPending,
        defaultValues,
    ]);

    useEffect(() => {
        if (mode !== "edit" || showPrefillSkeleton || !prefillSource) return;
        reset({
            first_name: prefillSource.first_name,
            last_name: prefillSource.last_name ?? "",
            email: prefillSource.email ?? "",
            phone: prefillSource.phone ?? "",
        });
    }, [mode, showPrefillSkeleton, prefillSource, reset]);

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
    const fieldsLocked = isPending || showPrefillSkeleton;

    const title = mode === "create" ? "Create Contact" : "Edit Contact";
    const submitLabel = mode === "create" ? "Create Contact" : "Update";

    const onCancelEdit = () => {
        if (isDirty && !window.confirm("Yakin menutup? Perubahan yang belum disimpan akan hilang.")) {
            return;
        }
        closeEditModal();
    };

    const cancelButtonClass =
        "cursor-pointer border-border bg-background/80 hover:bg-muted/60";

    return (
        <form onSubmit={handleSubmit(onSubmit)} aria-busy={showPrefillSkeleton || undefined}>

            <DialogHeader className="flex flex-col gap-4 pb-4">

                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                    {mode === "edit" ? (
                        <Pencil className="size-6 shrink-0 opacity-90" aria-hidden />
                    ) : (
                        <ContactIcon className="size-6 shrink-0 opacity-90" aria-hidden />
                    )}
                    {title}
                </DialogTitle>

                <FieldSet className="w-full">
                    {showPrefillSkeleton ? (
                        <div
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                            aria-busy="true"
                            aria-label="Memuat data kontak"
                        >
                            <div className="sm:col-span-2">
                                <ContactDetailFieldSkeleton />
                            </div>
                            <div className="sm:col-span-2">
                                <ContactDetailFieldSkeleton />
                            </div>
                            <div className="sm:col-span-2">
                                <ContactDetailFieldSkeleton />
                            </div>
                            <div className="sm:col-span-2">
                                <ContactDetailFieldSkeleton />
                            </div>
                        </div>
                    ) : (
                        <FieldGroup>
                            <InputField
                                label="First Name"
                                placeholder="Enter First Name"
                                error={errors.first_name?.message}
                                disabled={fieldsLocked}
                                {...register("first_name")}
                            />
                            <InputField
                                label="Last Name"
                                placeholder="Enter Last Name"
                                error={errors.last_name?.message}
                                disabled={fieldsLocked}
                                {...register("last_name")}
                            />
                            <InputField
                                label="Email"
                                placeholder="Enter Email"
                                error={errors.email?.message}
                                disabled={fieldsLocked}
                                {...register("email")}
                            />
                            <InputField
                                label="Phone"
                                placeholder="Enter Phone"
                                error={errors.phone?.message}
                                disabled={fieldsLocked}
                                {...register("phone")}
                            />
                        </FieldGroup>
                    )}
                </FieldSet>
            </DialogHeader>
            <DialogFooter>

                {mode === "edit" ? (
                    <Button
                        type="button"
                        variant="outline"
                        className={cancelButtonClass}
                        disabled={fieldsLocked}
                        onClick={onCancelEdit}
                    >
                        Cancel
                    </Button>
                ) : (
                    <DialogClose
                        render={
                            <Button
                                variant="outline"
                                className={cancelButtonClass}
                                disabled={fieldsLocked}
                            />
                        }
                    >
                        Cancel
                    </DialogClose>
                )}

                <Button
                    type="submit"
                    disabled={fieldsLocked}
                    variant="default"
                    className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    {isPending ? <Loader className="animate-spin" /> : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
};
