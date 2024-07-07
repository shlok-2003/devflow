import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                inter: "var(--font-inter)",
                "space-grotesk": "var(--font-space-grotesk)",
            },
            colors: {
                primary: {
                    "100": "#FFF1E6",
                    "500": "#FF7000",
                    "800": "#FFF1E6",
                },
                light: {
                    "400": "#858EAD",
                    "500": "#7B8EC8",
                    "700": "#DCE3F1",
                    "800": "#F4F6F8",
                    "850": "#FDFDFD",
                    "900": "#FFFFFF",
                },
                dark: {
                    "100": "#000000",
                    "200": "#0F1117",
                    "300": "#151821",
                    "400": "#212734",
                    "500": "#3F4354",
                },
                "accent-blue": "#1DA1F2",
            },
            boxShadow: {
                "light-100":
                    "0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px rgba(184, 184, 184, 0.02), 0px 2px 4px 0px rgba(184, 184, 184, 0.03)",
                "light-200": "10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
                "light-300": "-10px 10px 20px 0px rgba(218, 213, 213, 0.10)",
                "dark-100": "0px 2px 10px 0px rgba(46, 52, 56, 0.10)",
                "dark-200": "2px 0px 20px 0px rgba(39, 36, 36, 0.04)",
            },
            backgroundImage: {
                "auth-dark": "url('/assets/images/auth-dark.png')",
                "auth-light": "url('/assets/images/auth-light.png')",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [tailwindAnimate, tailwindTypography],
} satisfies Config;

export default config;
