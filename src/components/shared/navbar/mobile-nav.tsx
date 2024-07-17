"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

const NavContent = () => {
    const pathname = usePathname();

    return (
        <nav className="flex h-full flex-col gap-2 pt-16">
            {sidebarLinks.map((item, index) => {
                const isActive =
                    (pathname.includes(item.route) && item.route.length > 1) ||
                    pathname === item.route;

                return (
                    <SheetClose asChild key={index}>
                        <Link
                            href={item.route}
                            className={cn(
                                "flex items-center justify-start gap-4 bg-transparent p-4",
                                isActive
                                    ? "primary-gradient rounded-lg text-light-900"
                                    : "text-dark300_light900",
                            )}
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
                                    isActive ? "base-bold" : "base-medium",
                                )}
                            >
                                {item.label}
                            </p>
                        </Link>
                    </SheetClose>
                );
            })}
        </nav>
    );
};

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    src="/assets/icons/hamburger.svg"
                    height={36}
                    width={36}
                    alt="Menu"
                    className="invert-colors sm:hidden"
                />
            </SheetTrigger>
            <SheetContent
                side="left"
                className="background-light900_dark200 text-dark300_light900 border-none"
            >
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src="/assets/images/site-logo.svg"
                        height={23}
                        width={23}
                        alt="DevFlow"
                    />

                    <p className="h2-bold text-dark100_light900 font-space-grotesk">
                        Dev <span className="text-primary-500">OverFlow</span>
                    </p>
                </Link>

                <nav className="flex h-full flex-col justify-between pb-6">
                    <SheetClose asChild>
                        <NavContent />
                    </SheetClose>

                    <SignedOut>
                        <div className="flex flex-col gap-3">
                            <SheetClose asChild>
                                <Link href="/sign-in">
                                    <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                        <span className="primary-text-gradient">
                                            Log In
                                        </span>
                                    </Button>
                                </Link>
                            </SheetClose>

                            <SheetClose asChild>
                                <Link href="/sign-up">
                                    <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                                        Sign Up
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SignedOut>
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;
