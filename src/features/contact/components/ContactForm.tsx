import { InputField } from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Contact, Loader } from "lucide-react";
import { CreateContactSchema, type CreateContactPayload } from "../contact.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContact } from "../contact.hook";

export const ContactForm = () => {

    const { mutate, isPending } = useCreateContact();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateContactPayload>({
        resolver: zodResolver(CreateContactSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
        }
    })

    const onSubmit = (values: CreateContactPayload) => mutate(values, {
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="flex flex-col gap-4 pb-4">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                    <Contact />
                    Create Contact
                </DialogTitle>
                <FieldSet className="w-full">
                    <FieldGroup>
                        <InputField
                            label="First Name"
                            placeholder="Enter First Name"
                            error={errors.first_name?.message}
                            {...register("first_name")}
                        />
                        <InputField
                            label="Last Name"
                            placeholder="Enter Last Name"
                            error={errors.last_name?.message}
                            {...register("last_name")}
                        />
                        <InputField
                            label="Email"
                            placeholder="Enter Email"
                            error={errors.email?.message}
                            {...register("email")}
                        />
                        <InputField
                            label="Phone"
                            placeholder="Enter Phone"
                            error={errors.phone?.message}
                            {...register("phone")}
                        />
                    </FieldGroup>
                </FieldSet>
            </DialogHeader>
            <DialogFooter>
                <DialogClose render={<Button variant="outline" className="cursor-pointer" />}>Cancel</DialogClose>
                <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                    {isPending ? <Loader className="animate-spin" /> : "Create Contact"}
                </Button>
            </DialogFooter>
        </form>
    );
};
