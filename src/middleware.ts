import { NextResponse } from "next/server"
import { auth } from "@/auth";

export default auth((req)=>{
    const isloggedIn = !!req.auth;
    const {pathname} = req.nextUrl;

    const isAuthRoute = pathname === "/login" || pathname === "/signup";
    //hybrid route—anyone can see it
    const isPublicRoute = pathname === "/";

    // Unlogged users trying to access get kicked to login
    if(!isloggedIn && !isPublicRoute && !isAuthRoute){
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Logged-in users trying to go to /login get kicked
    if(isloggedIn && isAuthRoute){
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    //proceed normally
    return NextResponse.next();
});

// run this middleware on every route EXCEPT static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}