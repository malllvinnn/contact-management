import { useQuery } from "@tanstack/react-query";
import { addressService } from "./address.service";

export const useListAddresses = (contactId: string) => {

    return useQuery({
        queryKey: ["contacts", contactId, "addresses"],
        queryFn: () => addressService.listAddresses(contactId),
        enabled: !!contactId,
    });
};
