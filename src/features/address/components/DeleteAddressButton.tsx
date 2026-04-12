import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useRemoveAddress } from "../address.hook";

interface DeleteAddressButtonProps {
    contactId: string;
    addressId: string;
    addressLabel: string;
}

export const DeleteAddressButton = ({
    contactId,
    addressId,
    addressLabel,
}: DeleteAddressButtonProps) => {

    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useRemoveAddress(contactId);

    const handleConfirm = () => {
        mutate(addressId, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="cursor-pointer"
                disabled={isPending}
                onClick={() => setOpen(true)}
                aria-label="Hapus Alamat"
            >
                <Trash2 className="size-4" aria-hidden />
            </Button>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Alamat?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Alamat <strong>{addressLabel}</strong> akan dihapus permanen.
                        Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                    <AlertDialogAction
                        type="button"
                        variant="destructive"
                        disabled={isPending}
                        onClick={handleConfirm}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {isPending ? (
                                <Spinner className="size-4" aria-hidden />
                            ) : null}
                            Hapus
                        </span>
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};
