import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            role="navigation"
            aria-label="Pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            className={cn("flex flex-row flex-wrap items-center justify-center gap-1", className)}
            {...props}
        />
    );
}

function PaginationItem({ className, ...props }: React.ComponentProps<"li">) {
    return <li className={cn("", className)} {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
    return (
        <button
            type="button"
            className={cn(
                buttonVariants({
                    variant: isActive ? "outline" : "ghost",
                    size: "icon-sm",
                }),
                "min-w-8",
                className
            )}
            {...props}
        />
    );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<"button">) {
    return (
        <button
            type="button"
            className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1",
                className
            )}
            {...props}
        >
            <ChevronLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Prev</span>
        </button>
    );
}

function PaginationNext({ className, ...props }: React.ComponentProps<"button">) {
    return (
        <button
            type="button"
            className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1",
                className
            )}
            {...props}
        >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" aria-hidden />
        </button>
    );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            className={cn("flex h-8 w-9 items-center justify-center", className)}
            {...props}
        >
            <MoreHorizontal className="size-4 text-muted-foreground" />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
