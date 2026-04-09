import { InputField } from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, User } from "lucide-react";
import { useParams } from "react-router";
import { useGetContact } from "../contact.hook";
import { useContactStore } from "../contact.store";
import { ContactContainer } from "./ContactContainer";
import { ContactDetailFieldSkeleton } from "./ContactDetailFieldSkeleton";
import { ContactDetailError } from "./ContactDetailError";

export const ContactDetail = () => {

    const openEditModal = useContactStore((s) => s.openEditModal);
    const { id } = useParams();
    const { data, isLoading, isError } = useGetContact(id ?? "");
    const contact = data?.data;

    if (!id) {
        return (
            <ContactContainer title="Contact" icon={User} backButton>
                <div className="page-card">
                    <ContactDetailError message="Contact not found" />
                </div>
            </ContactContainer>
        );
    }

    if (isLoading) {
        return (
            <ContactContainer title="Contact Detail" icon={User} backButton>
                <div
                    className="page-card"
                    aria-busy="true"
                    aria-label="Memuat detail kontak"
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ContactDetailFieldSkeleton />
                        <ContactDetailFieldSkeleton />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <ContactDetailFieldSkeleton />
                        <ContactDetailFieldSkeleton />
                    </div>
                </div>
            </ContactContainer>
        );
    }

    if (isError) {
        return (
            <ContactContainer title="Contact" icon={User} backButton>
                <div className="page-card">
                    <ContactDetailError message="Contact not found" />
                </div>
            </ContactContainer>
        );
    }

    if (!contact) {
        return (
            <ContactContainer title="Contact" icon={User} backButton>
                <div className="page-card">
                    <ContactDetailError message="Contact not found" />
                </div>
            </ContactContainer>
        );
    }

    const readOnlyInputClass = cn(
        "h-9 cursor-default bg-muted/40 text-sm md:h-10 md:text-base"
    );

    return (
        <ContactContainer title="Contact Detail" icon={User} backButton>
            <div className="page-card">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => openEditModal(contact)}
                    >
                        <Pencil className="size-3.5" aria-hidden />
                        Edit
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        id="contact-first-name"
                        name="first_name"
                        label="First Name"
                        readOnly
                        tabIndex={-1}
                        value={contact.first_name || "—"}
                        className={readOnlyInputClass}
                    />
                    <InputField
                        id="contact-last-name"
                        name="last_name"
                        label="Last Name"
                        readOnly
                        tabIndex={-1}
                        value={contact.last_name || "—"}
                        className={readOnlyInputClass}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <InputField
                        id="contact-email"
                        name="email"
                        label="Email"
                        readOnly
                        tabIndex={-1}
                        type="email"
                        autoComplete="off"
                        value={contact.email || "—"}
                        className={readOnlyInputClass}
                    />
                    <InputField
                        id="contact-phone"
                        name="phone"
                        label="Phone"
                        readOnly
                        tabIndex={-1}
                        type="tel"
                        autoComplete="off"
                        value={contact.phone || "—"}
                        className={readOnlyInputClass}
                    />
                </div>
            </div>
        </ContactContainer>
    );
};
