import { TitleBar } from "@/components/TitleBar";
import { useSearchContacts } from "@/features/contact/contact.hook";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;
const CONTACTS_PAGE_SIZE = 10;

const DashboardPage = () => {
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [phoneInput, setPhoneInput] = useState("");

    const [searchName, setSearchName] = useState("");
    const [searchEmail, setSearchEmail] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const id = window.setTimeout(() => {
            setSearchName(nameInput.trim());
            setSearchEmail(emailInput.trim());
            setSearchPhone(phoneInput.trim());
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => window.clearTimeout(id);
    }, [nameInput, emailInput, phoneInput]);

    const params = useMemo(
        () => ({
            name: searchName || undefined,
            email: searchEmail || undefined,
            phone: searchPhone || undefined,
            page: currentPage,
            size: CONTACTS_PAGE_SIZE,
        }),
        [searchName, searchEmail, searchPhone, currentPage]
    );

    const { data, isLoading, isFetching } = useSearchContacts(params);

    const contacts = data?.data ?? [];
    const totalPages = data?.paging.total_page ?? 1;

    return (
        <>
            <TitleBar title="Dashboard" icon={Home} />

            <div className="px-6 md:px-8 lg:px-12 2xl:px-24 py-6 space-y-4">

                <div className="flex flex-wrap gap-3 max-w-2xl">
                    <Input
                        type="search"
                        placeholder="Search by name..."
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        autoComplete="off"
                        className="flex-1 min-w-40"
                    />
                    <Input
                        type="search"
                        placeholder="Search by email..."
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        autoComplete="off"
                        className="flex-1 min-w-40"
                    />
                    <Input
                        type="search"
                        placeholder="Search by phone..."
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        autoComplete="off"
                        className="flex-1 min-w-40"
                    />
                </div>

                {isLoading ? (
                    <p className="text-muted-foreground text-sm">Loading...</p>
                ) : contacts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Tidak ada kontak</p>
                ) : (
                    <ul className={`divide-y divide-border rounded-lg border transition-opacity duration-150 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
                        {contacts.map((contact) => (
                            <li key={contact.id} className="flex flex-col gap-0.5 px-4 py-3">
                                <span className="font-medium">
                                    {contact.first_name}{contact.last_name ? ` ${contact.last_name}` : ""}
                                </span>
                                {contact.email && (
                                    <span className="text-sm text-muted-foreground">{contact.email}</span>
                                )}
                                {contact.phone && (
                                    <span className="text-sm text-muted-foreground">{contact.phone}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {!isLoading && contacts.length > 0 && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage <= 1 || isFetching}
                        >
                            Prev
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Halaman {currentPage} dari {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages || isFetching}
                        >
                            Next
                        </Button>
                    </div>
                )}

            </div>
        </>
    );
};

export default DashboardPage;
