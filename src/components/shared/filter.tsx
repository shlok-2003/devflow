"use client";

import React from "react";
import { SelectGroup } from "@radix-ui/react-select";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { cn, formUrlQuery } from "@/lib/utils";
import { FilterProps } from "@/constants/filters";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterCompProps extends React.HTMLAttributes<HTMLElement> {
    filters: FilterProps[];
    triggerClassName?: string;
}

const Filter: React.FC<FilterCompProps> = ({
    filters,
    className,
    triggerClassName = "",
    ...props
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const paramFilter = searchParams.get("filter");

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
        });

        router.push(newUrl, { scroll: false });
    };

    return (
        <div className={cn("relative", className)} {...props}>
            <Select
                onValueChange={(value) => handleUpdateParams(value)}
                defaultValue={paramFilter || undefined}
            >
                <SelectTrigger
                    className={cn(
                        "body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5",
                        triggerClassName,
                    )}
                >
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Select a Filter" />
                    </div>
                </SelectTrigger>
                <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
                    <SelectGroup>
                        {filters.map((filter, index) => (
                            <SelectItem
                                key={index}
                                value={filter.value}
                                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400"
                            >
                                {filter.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default Filter;
