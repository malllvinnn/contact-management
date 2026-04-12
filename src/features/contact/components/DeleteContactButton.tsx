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
import { useRemoveContact } from "../contact.hook";
import { Trash2 } from "lucide-react";

export interface DeleteContactButtonProps {
    contactId: string;
    contactName: string;
    afterDelete?: () => void;
}

export const DeleteContactButton = ({
    contactId,
    contactName,
    afterDelete,
}: DeleteContactButtonProps) => {

    const [open, setOpen] = useState(false);
    const { mutate, isPending } = useRemoveContact();

    const handleConfirm = () => {

        mutate(contactId, {
            onSuccess: () => {
                setOpen(false);
                afterDelete?.();
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>

            <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                <span className="flex items-center gap-1">
                    <Trash2 className="size-3.5" aria-hidden />
                    Delete
                </span>
            </Button>

            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Kontak?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Kontak {contactName}{" "}
                        akan dihapus permanen.
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
