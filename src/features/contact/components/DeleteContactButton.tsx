import { Button } from "@/components/ui/button";
import { useRemoveContact } from "../contact.hook";

export interface DeleteContactButtonProps {
    contactId: string;
    contactName: string;
    afterDelete?: () => void;
}

const CONFIRM_MESSAGE = "Yakin ingin menghapus kontak ini?";

export const DeleteContactButton = ({
    contactId,
    contactName,
    afterDelete,
}: DeleteContactButtonProps) => {

    const { mutate, isPending } = useRemoveContact(contactId);

    const handleClick = () => {
        const message =
            contactName && contactName !== "—"
                ? `Yakin ingin menghapus kontak "${contactName}"?`
                : CONFIRM_MESSAGE;
        if (!window.confirm(message)) return;
        mutate(undefined, {
            onSuccess: () => afterDelete?.(),
        });
    };

    return (
        <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleClick}
        >
            Delete
        </Button>
    );
};
