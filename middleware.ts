import { clerkMiddleware , createRouteMatcher } from "@clerk/nextjs/server";

const ProtectedRoute = createRouteMatcher([
    "/",
    "/upcoming",
    "/previous",
    "/recordings",
    "/personal-room",
    "/meeting(.*)"
])

export default clerkMiddleware((auth , req)=>{
    if(ProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};