"use client";

import React from "react";

import { Button } from "../ui/button";
import { HomePageFilters } from "@/constants/filters";
import { cn } from "@/lib/utils";

const HomeFilter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = React.useState<number>(0);

    return (
        <div className="mt-10 hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((filter, index) => (
                <Button
                    key={index}
                    onClick={() => setIsActive(index)}
                    className={cn(
                        "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
                        isActive === index
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
