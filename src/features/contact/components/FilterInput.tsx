import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X, type LucideIcon } from "lucide-react";

type FilterInputProps = {
    icon: LucideIcon;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    clearLabel: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export const FilterInput = ({
    icon: Icon,
    value,
    onChange,
    placeholder,
    clearLabel,
    inputMode,
}: FilterInputProps) => (
    <div className="relative w-full min-w-0 max-w-full">
        <Icon
            className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
        />
        <Input
            type="text"
            inputMode={inputMode}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            className={cn("w-full pl-9", value ? "pr-10" : "pr-3")}
        />
        {value ? (
            <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute right-1 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => onChange("")}
                aria-label={clearLabel}
            >
                <X className="size-3.5" aria-hidden />
            </Button>
        ) : null}
    </div>
);