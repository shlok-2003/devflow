import React from "react";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk as SpaceGrotesk } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const spaceGrotesk = SpaceGrotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
    title: "DevOverflow",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development, algorithms, data structure and more.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
