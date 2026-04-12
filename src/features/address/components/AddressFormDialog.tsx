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

    const { isOpenCreateModal, openCreateModal, closeCreateModal } = useAddressStore();

    return (
        <Dialog
            open={isOpenCreateModal}
            onOpenChange={(open) => (open ? openCreateModal() : closeCreateModal())}
        >
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
                    <DialogTitle>Tambah Alamat</DialogTitle>
                </DialogHeader>
                <AddressForm contactId={contactId} />
            </DialogContent>
        </Dialog>
    );
};
