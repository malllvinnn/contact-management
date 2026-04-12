import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ContactCardSkeleton = ({ className }: { className?: string }) => (
    <div
        className={cn(
            "rounded-xl border border-border bg-card p-4",
            className
        )}
    >
        <div className="flex gap-4">
            <Skeleton className="size-12 shrink-0 rounded-full" aria-hidden />
            <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-4 w-4/5 max-w-[220px]" aria-hidden />
                <Skeleton className="h-3 w-3/5 max-w-[160px]" aria-hidden />
            </div>
        </div>
    </div>
);
