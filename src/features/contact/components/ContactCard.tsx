import { Mail, Pencil, Phone, Search } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContactStore } from "../contact.store";
import type { Contact } from "../contact.types";
import { DeleteContactButton } from "./DeleteContactButton";

function displayName(contact: Contact): string {
    const s = [contact.first_name, contact.last_name].filter(Boolean).join(" ").trim();
    return s || "—";
}

function initials(contact: Contact): string {
    const f = contact.first_name?.trim() ?? "";
    const l = contact.last_name?.trim() ?? "";
    if (f && l) return `${f[0]!}${l[0]!}`.toUpperCase();
    if (f.length >= 2) return f.slice(0, 2).toUpperCase();
    if (f.length === 1) return f.toUpperCase();
    return "?";
}

export interface ContactCardProps {
    contact: Contact;
    className?: string;
}

export const ContactCard = ({ contact, className }: ContactCardProps) => {

    const openEditModal = useContactStore((s) => s.openEditModal);
    const title = displayName(contact);

    return (
        <article
            className={cn(
                "rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200",
                "hover:border-ring/60 hover:shadow-md",
                className
            )}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex shrink-0 items-center self-stretch sm:min-h-0">
                    <Avatar size="lg" className="size-12 shrink-0">
                        <AvatarFallback className="text-sm font-medium">
                            {initials(contact)}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="truncate text-base font-semibold">
                        <Link
                            to={`/dashboard/contacts/${contact.id}`}
                            className="group inline-flex max-w-full min-w-0 items-center gap-1.5 text-foreground hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span className="truncate">{title}</span>
                            <Search
                                className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:scale-110 group-hover:text-foreground"
                                aria-hidden
                            />
                        </Link>
                    </h3>
                    {contact.email ? (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-3.5 shrink-0" aria-hidden />
                            <span className="truncate">{contact.email}</span>
                        </p>
                    ) : null}
                    {contact.phone ? (
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="size-3.5 shrink-0" aria-hidden />
                            <span>{contact.phone}</span>
                        </p>
                    ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-stretch">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => openEditModal(contact)}
                    >
                        <Pencil className="size-3.5" aria-hidden />
                        Edit
                    </Button>
                    <DeleteContactButton contactId={contact.id} contactName={title} />
                </div>
            </div>
        </article>
    );
};
