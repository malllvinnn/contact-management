import { Skeleton } from "@/components/ui/skeleton";

export const ContactDetailFieldSkeleton = () => {
    return (
        <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" aria-hidden />
            <Skeleton className="h-10 w-full max-w-full" aria-hidden />
        </div>
    );
};
