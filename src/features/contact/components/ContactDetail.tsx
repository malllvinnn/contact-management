import { TitleBar } from "@/components/TitleBar";
import { InputField } from "@/components/form/InputField";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { useParams } from "react-router";
import { useGetContact } from "../contact.hook";

export const ContactDetail = () => {

    const { id } = useParams();

    const { data, isLoading, isError } = useGetContact(id ?? "");

    if (!id) {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <TitleBar title="Contact" icon={User} backButton />
                <div className="px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                    <p className="text-sm text-destructive" role="alert">
                        Contact not found
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <TitleBar title="Contact" icon={User} backButton />
                <div className="px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <TitleBar title="Contact" icon={User} backButton />
                <div className="px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                    <p className="text-sm text-destructive" role="alert">
                        Contact not found
                    </p>
                </div>
            </div>
        );
    }

    const contact = data?.data;

    if (!contact) {
        return (
            <div className="flex min-h-0 flex-1 flex-col">
                <TitleBar title="Contact" icon={User} backButton />
                <div className="px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                    <p className="text-sm text-destructive" role="alert">
                        Contact not found
                    </p>
                </div>
            </div>
        );
    }

    const readOnlyInputClass = cn(
        "h-9 cursor-default bg-muted/40 text-sm md:h-10 md:text-base"
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <TitleBar title="Contact Detail" icon={User} backButton />

            <div className="flex min-h-0 flex-1 flex-col gap-6 px-6 py-6 md:px-8 lg:px-12 2xl:px-24">
                <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
                    <InputField
                        id="contact-first-name"
                        name="first_name"
                        label="First Name"
                        readOnly
                        tabIndex={-1}
                        value={contact.first_name || "—"}
                        className={readOnlyInputClass}
                    />
                    <InputField
                        id="contact-last-name"
                        name="last_name"
                        label="Last Name"
                        readOnly
                        tabIndex={-1}
                        value={contact.last_name || "—"}
                        className={readOnlyInputClass}
                    />
                </div>

                <div className="grid max-w-xl grid-cols-1 gap-4">
                    <InputField
                        id="contact-email"
                        name="email"
                        label="Email"
                        readOnly
                        tabIndex={-1}
                        type="email"
                        autoComplete="off"
                        value={contact.email || "—"}
                        className={readOnlyInputClass}
                    />
                    <InputField
                        id="contact-phone"
                        name="phone"
                        label="Phone"
                        readOnly
                        tabIndex={-1}
                        type="tel"
                        autoComplete="off"
                        value={contact.phone || "—"}
                        className={readOnlyInputClass}
                    />
                </div>
            </div>
        </div>
    );
};
