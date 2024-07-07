"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Input } from "@/components/ui/input";

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
                value=""
                onChange={(e) => {}}
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
