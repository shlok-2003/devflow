import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher([
    "/",
    "/api/webhook",
    "api/gemini",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/jobs",
    "/sign-up(.*)",
    "/sign-in(.*)",
]);

export default clerkMiddleware((auth, request) => {
    if (!publicRoutes(request)) {
        auth().protect();
    }
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
