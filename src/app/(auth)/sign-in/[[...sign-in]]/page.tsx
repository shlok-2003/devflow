import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="flex h-screen flex-row items-center justify-center">
            <SignIn />
        </main>
    );
}
