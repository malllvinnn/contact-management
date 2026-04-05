import { TitleBar } from "@/components/TitleBar";
import { ContactCard } from "@/features/contact/components/ContactCard";
import { ContactCardSkeleton } from "@/features/contact/components/ContactCardSkeleton";
import { useSearchContacts } from "@/features/contact/contact.hook";
import { useContactStore } from "@/features/contact/contact.store";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { buildPaginationItems } from "@/lib/pagination";
import { Home, Mail, Phone, Search, UserX, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FilterInput } from "@/features/contact/components/FilterInput";

const SEARCH_DEBOUNCE_MS = 300;
const CONTACTS_PAGE_SIZE = 10;

const DashboardPage = () => {

    const openCreateModal = useContactStore((s) => s.openCreateModal);

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

    const hasActiveFilters = Boolean(
        searchName || searchEmail || searchPhone
    );

    const { data, isLoading, isFetching } = useSearchContacts(params);

    const contacts = data?.data ?? [];
    const totalPages = Math.max(1, data?.paging?.total_page ?? 1);
    const pageItems = buildPaginationItems(currentPage, totalPages);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <TitleBar title="Dashboard" icon={Home} />

            <div className="flex min-h-0 flex-1 flex-col px-6 py-6 md:px-8 lg:px-12 2xl:px-24">

                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3 bg-card p-4 rounded-lg shadow-sm border border-border">
                    <FilterInput
                        icon={Search}
                        placeholder="Nama (depan / belakang)…"
                        value={nameInput}
                        onChange={setNameInput}
                        clearLabel="Hapus filter nama"
                        inputMode="search"
                    />

                    <FilterInput
                        icon={Mail}
                        placeholder="Email…"
                        value={emailInput}
                        onChange={setEmailInput}
                        clearLabel="Hapus filter email"
                        inputMode="email"
                    />

                    <FilterInput
                        icon={Phone}
                        placeholder="Telepon…"
                        value={phoneInput}
                        onChange={setPhoneInput}
                        clearLabel="Hapus filter telepon"
                        inputMode="tel"
                    />
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    {isLoading ? (
                        <div
                            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                            aria-busy="true"
                            aria-label="Memuat kontak"
                        >
                            {Array.from({ length: CONTACTS_PAGE_SIZE }, (_, i) => (
                                <ContactCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
                            {hasActiveFilters ? (
                                <>
                                    <UserX
                                        className="size-12 text-muted-foreground"
                                        strokeWidth={1.25}
                                        aria-hidden
                                    />
                                    <p className="text-muted-foreground max-w-sm text-sm">
                                        Tidak ada kontak yang cocok dengan pencarian
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Users
                                        className="size-12 text-muted-foreground"
                                        strokeWidth={1.25}
                                        aria-hidden
                                    />
                                    <p className="text-muted-foreground max-w-sm text-sm">
                                        Belum ada kontak
                                    </p>
                                </>
                            )}

                            <Button type="button" onClick={() => openCreateModal()}>
                                Add Contact
                            </Button>
                        </div>
                    ) : (
                        <div className="flex min-h-0 flex-1 flex-col gap-4">
                            <div
                                className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 transition-opacity duration-150 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                {contacts.map((contact) => (
                                    <ContactCard key={contact.id} contact={contact} />
                                ))}
                            </div>

                            <div className="mt-auto flex shrink-0 flex-col items-stretch gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <p className="text-muted-foreground shrink-0 whitespace-nowrap text-center text-sm sm:text-left">
                                    Halaman {currentPage} dari {totalPages}
                                </p>

                                <Pagination className="mx-0 w-auto min-w-0 justify-center">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                disabled={currentPage <= 1 || isFetching}
                                                onClick={() =>
                                                    setCurrentPage((p) => Math.max(1, p - 1))
                                                }
                                            />
                                        </PaginationItem>
                                        {pageItems.map((item, idx) =>
                                            item === "ellipsis" ? (
                                                <PaginationItem key={`e-${idx}`}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={item}>
                                                    <PaginationLink
                                                        isActive={item === currentPage}
                                                        disabled={isFetching}
                                                        onClick={() => setCurrentPage(item)}
                                                        aria-label={`Halaman ${item}`}
                                                        aria-current={
                                                            item === currentPage
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    >
                                                        {item}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                disabled={
                                                    currentPage >= totalPages || isFetching
                                                }
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.min(totalPages, p + 1)
                                                    )
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>

                                <p
                                    className="hidden shrink-0 whitespace-nowrap text-center text-sm text-muted-foreground sm:block sm:invisible sm:text-left"
                                    aria-hidden="true"
                                >
                                    Halaman {currentPage} dari {totalPages}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
