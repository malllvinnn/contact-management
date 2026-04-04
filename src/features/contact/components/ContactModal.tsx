import { AppButton } from "@/components/AppButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useContactStore } from "@/features/contact/contact.store";
import { Plus } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const ContactModal = () => {

    const { isOpenCreateModal, openCreateModal, closeCreateModal } = useContactStore();

    return (
        <Dialog open={isOpenCreateModal} onOpenChange={(open) => !open && closeCreateModal()}>

            <DialogTrigger render={
                <AppButton
                    onClick={openCreateModal}
                    label="Create Contact"
                    icon={<Plus strokeWidth={3.5} size={32} className="text-foreground" />}
                />
            } />

            <DialogContent>
                <ContactForm />
            </DialogContent>
        </Dialog>
    );
};
