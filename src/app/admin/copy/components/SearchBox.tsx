"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui";

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    /** Accessible name */
    label: string;
}

export function SearchBox({ value, onChange, placeholder, label }: SearchBoxProps) {
    return (
        <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <Input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                aria-label={label}
                autoComplete="off"
                className="ps-9"
            />
        </div>
    );
}
