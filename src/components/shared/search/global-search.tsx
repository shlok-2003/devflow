"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import GlobalResult from "@/components/shared/search/gloabl-result";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

const GlobalSearch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const query = searchParams.get("q") || "";

    const [search, setSearch] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "global",
                    value: search,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["global", "type"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, searchParams, pathname, router, query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setSearch("");
            }
        };

        setIsOpen(false);
        setSearch("");

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [pathname]);

    return (
        <section
            className="relative w-full max-w-[600px] max-lg:hidden"
            ref={searchContainerRef}
        >
            <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />

                <Input
                    type="text"
                    placeholder="Search Globally"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                        if (e.target.value === "" && isOpen) setIsOpen(false);
                    }}
                    className="paragraph-regular no-focus placeholder text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none"
                />
            </div>

            {isOpen && <GlobalResult />}
        </section>
    );
};

export default GlobalSearch;
