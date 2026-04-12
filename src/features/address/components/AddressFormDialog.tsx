import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAddressStore } from "../address.store";
import { AddressForm } from "./AddressForm";

interface AddressFormDialogProps {
    contactId: string;
}

export const AddressFormDialog = ({ contactId }: AddressFormDialogProps) => {

    const {
        isOpenCreateModal, openCreateModal, closeCreateModal,
        isOpenEditModal, closeEditModal, selectedAddress,
    } = useAddressStore();

    const isOpen = isOpenCreateModal || isOpenEditModal;

    const handleOpenChange = (open: boolean) => {
        if (open) {
            openCreateModal();
            return;
        }
        if (isOpenEditModal) closeEditModal();
        else closeCreateModal();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer gap-1.5"
                    />
                }
            >
                <Plus className="size-4" aria-hidden />
                Tambah Alamat
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isOpenEditModal ? "Edit Alamat" : "Tambah Alamat"}
                    </DialogTitle>
                </DialogHeader>
                {isOpenEditModal && selectedAddress ? (
                    <AddressForm
                        mode="edit"
                        contactId={contactId}
                        addressId={selectedAddress.id}
                        defaultValues={selectedAddress}
                    />
                ) : (
                    <AddressForm contactId={contactId} />
                )}
            </DialogContent>
        </Dialog>
    );
};
