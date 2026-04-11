import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const AddressCardSkeleton = ({ className }: { className?: string }) => (
    <div
        className={cn(
            "rounded-xl border border-border bg-card p-4",
            className
        )}
    >
        <div className="flex gap-3">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded" aria-hidden />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-4 w-2/5 max-w-[120px]" aria-hidden />
                <Skeleton className="h-3 w-3/5 max-w-[180px]" aria-hidden />
                <Skeleton className="h-3 w-2/4 max-w-[150px]" aria-hidden />
                <Skeleton className="h-3 w-1/4 max-w-[80px]" aria-hidden />
            </div>
        </div>
    </div>
);
