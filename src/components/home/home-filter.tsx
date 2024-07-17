"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants/filters";
import { cn, formUrlQuery } from "@/lib/utils";

const HomeFilter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isActive, setIsActive] = useState<string>("");

    const handleTypeClick = (item: string) => {
        if (isActive === item) {
            setIsActive("");
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: null,
            });

            router.push(newUrl, { scroll: false });
        } else {
            setIsActive(item);
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: item.toLowerCase(),
            });

            router.push(newUrl, { scroll: false });
        }
    };

    return (
        <div className="mt-10 hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((filter, index) => (
                <Button
                    key={index}
                    onClick={() => handleTypeClick(filter.value)}
                    className={cn(
                        "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
                        isActive === filter.value
                            ? "bg-primary-100 text-primary-500 dark:bg-dark-400 dark:text-primary-500"
                            : "bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-400",
                    )}
                >
                    {filter.name}
                </Button>
            ))}

            {children}
        </div>
    );
};

export default HomeFilter;
