import { FC, ReactNode, HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";

import MobileNav from "@/components/shared/navbar/mobile-nav";
import ModeToggle from "@/components/shared/navbar/mode-toggle";
import GlobalSearch from "@/components/shared/search/global-search";

import { cn } from "@/lib/utils";

interface NavbarProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
}

const Navbar: FC<NavbarProps> = ({ children, className, ...props }) => {
    return (
        <header
            className={cn(
                "background-light900_dark200 flex-between fixed inset-x-0 top-0 z-50 w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12",
                className,
            )}
            {...props}
        >
            <Link href="/" className="flex select-none items-center gap-1">
                <Image
                    src="/assets/images/site-logo.svg"
                    height={23}
                    width={23}
                    alt="DevFlow"
                />

                <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
                    Dev <span className="text-primary-500">Flow</span>
                </p>

                {children}
            </Link>
            <GlobalSearch />
            <nav className="flex-between h-full gap-5">
                <ModeToggle />
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "size-10",
                            },
                            variables: {
                                colorPrimary: "#FF7000",
                            },
                        }}
                    />
                </SignedIn>
                <MobileNav />
            </nav>
        </header>
    );
};

export default Navbar;
