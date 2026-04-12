import { MapPinOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressEmptyStateProps {
    onAddClick?: () => void;
}

export const AddressEmptyState = ({ onAddClick }: AddressEmptyStateProps) => (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
        <MapPinOff className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
            <p className="text-sm font-medium">Belum ada alamat</p>
            <p className="text-sm text-muted-foreground">
                Tambahkan alamat untuk kontak ini.
            </p>
        </div>
        {onAddClick && (
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 cursor-pointer gap-1.5"
                onClick={onAddClick}
            >
                <Plus className="size-4" aria-hidden />
                Tambah Alamat
            </Button>
        )}
    </div>
);
