"use client";

import { useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";

const GlobalSearch = () => {
    const [search, setSearch] = useState<string>("");

    return (
        <section className="relative w-full max-w-[600px] max-lg:hidden">
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
                    onChange={(e) => setSearch(e.target.value)}
                    className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
                />
            </div>
        </section>
    );
};

export default GlobalSearch;
