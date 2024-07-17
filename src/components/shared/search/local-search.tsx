"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

import { cn, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

interface LocalSearchProps extends React.HTMLAttributes<HTMLElement> {
    route: string;
    iconPosition?: "left" | "right";
    imgSrc: string;
    placeholder: string;
}

const LocalSearch: React.FC<LocalSearchProps> = ({
    route,
    imgSrc,
    placeholder,
    iconPosition = "left",
    className,
    ...props
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get("q") || "";
    const [searchQuery, setSearchQuery] = useState<string>(query);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "q",
                    value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["q"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, searchParams, route, pathname, router, query]);

    return (
        <div
            className={cn(
                "background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4",
                className,
            )}
            {...props}
        >
            {iconPosition === "left" && (
                <Image
                    src={imgSrc}
                    alt="search icon"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                />
            )}

            <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
            />

            {iconPosition === "right" && (
                <Image
                    src={imgSrc}
                    alt="search icon"
                    height={24}
                    width={24}
                    className="cursor-pointer"
                />
            )}
        </div>
    );
};

export default LocalSearch;
