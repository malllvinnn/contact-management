import { useListAddresses } from "../address.hook";

interface AddressSectionProps {
    contactId: string;
}

export const AddressSection = ({ contactId }: AddressSectionProps) => {

    const { data, isLoading, isError } = useListAddresses(contactId);
    const addresses = data?.data;

    return (
        <div className="page-card">
            <h2 className="text-base font-semibold md:text-lg">Alamat</h2>

            {isLoading && (
                <p className="text-sm text-muted-foreground">Memuat alamat...</p>
            )}

            {isError && (
                <p className="text-sm text-destructive">Gagal memuat alamat.</p>
            )}

            {!isLoading && !isError && addresses && addresses.length === 0 && (
                <p className="text-sm text-muted-foreground">Belum ada alamat.</p>
            )}

            {!isLoading && !isError && addresses && addresses.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {addresses.map((address) => (
                        <li
                            key={address.id}
                            className="rounded-md border px-4 py-3 text-sm"
                        >
                            <p className="font-medium">{address.country}</p>
                            {address.city && (
                                <p className="text-muted-foreground">{address.city}</p>
                            )}
                            <p className="text-muted-foreground">{address.postal_code}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
