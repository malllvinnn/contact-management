import { AppButton } from "@/components/AppButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContactStore } from "@/features/contact/contact.store";
import { Plus } from "lucide-react";
import { ContactForm } from "./ContactForm";

export interface ContactModalProps {
    showCreateTrigger?: boolean;
}

export const ContactModal = ({ showCreateTrigger = true }: ContactModalProps) => {

    const {
        isOpenCreateModal,
        openCreateModal,
        closeCreateModal,
        isOpenEditModal,
        selectedContact,
        closeEditModal,
    } = useContactStore();

    return (
        <>
            <Dialog open={isOpenCreateModal} onOpenChange={(open) => !open && closeCreateModal()}>

                {showCreateTrigger ? (
                    <DialogTrigger render={
                        <AppButton
                            onClick={openCreateModal}
                            label="Create Contact"
                            icon={<Plus strokeWidth={3.5} size={32} className="text-foreground" />}
                        />
                    } />
                ) : null}

                <DialogContent>
                    <ContactForm mode="create" />
                </DialogContent>
            </Dialog>

            <Dialog open={isOpenEditModal} onOpenChange={(open) => !open && closeEditModal()}>
                <DialogContent>
                    {selectedContact ? (
                        <ContactForm
                            key={selectedContact.id}
                            mode="edit"
                            defaultValues={selectedContact}
                        />
                    ) : null}
                </DialogContent>
            </Dialog>
        </>
    );
};
