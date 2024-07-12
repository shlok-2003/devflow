"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants";

interface LeftSideBarProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
}

const LeftSideBar: React.FC<LeftSideBarProps> = ({
    children,
    className,
    ...props
}) => {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "background-light900_dark200 light-border custom-scrollbar no-scrollbar sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]",
                className,
            )}
            {...props}
        >
            <div className="flex flex-1 flex-col gap-2">
                {sidebarLinks.map((item, index) => {
                    const isActive =
                        (pathname.includes(item.route) &&
                            item.route.length > 1) ||
                        pathname === item.route;

                    return (
                        <Link
                            href={item.route}
                            className={cn(
                                "flex items-center justify-start gap-4 bg-transparent p-4",
                                isActive
                                    ? "primary-gradient rounded-lg text-light-900"
                                    : "text-dark300_light900",
                            )}
                            key={index}
                        >
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                className={cn(isActive && "invert-colors")}
                            />

                            <p
                                className={cn(
                                    "max-lg:hidden",
                                    isActive ? "base-bold" : "base-medium",
                                )}
                            >
                                {item.label}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <SignedOut>
                <div className="flex flex-col gap-3">
                    <Link href="/sign-in">
                        <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                            <Image
                                src="/assets/icons/account.svg"
                                alt="login"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="primary-text-gradient max-lg:hidden">
                                Log In
                            </span>
                        </Button>
                    </Link>

                    <Link href="/sign-up">
                        <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                            <Image
                                src="/assets/icons/account.svg"
                                alt="login"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="max-lg:hidden">Sign Up</span>
                        </Button>
                    </Link>
                </div>
            </SignedOut>
            {children}
        </aside>
    );
};

export default LeftSideBar;
