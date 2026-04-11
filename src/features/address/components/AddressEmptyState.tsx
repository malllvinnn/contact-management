import { MapPinOff } from "lucide-react";

export const AddressEmptyState = () => (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
        <MapPinOff className="size-10 text-muted-foreground" aria-hidden />
        <div className="space-y-1">
            <p className="text-sm font-medium">Belum ada alamat</p>
            <p className="text-sm text-muted-foreground">
                Tambahkan alamat untuk kontak ini.
            </p>
        </div>
        {/* Placeholder tombol CTA "Tambah Alamat" — diisi di Issue #34 */}
    </div>
);
