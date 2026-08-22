import { NextResponse } from "next/server"
import { auth } from "@/auth";

export default auth((req)=>{
    const isloggedIn = !!req.auth;
    const {pathname} = req.nextUrl;

    //which routes don't require you to be logged in
    const isPublicRoute = pathname == "/login" || pathname == "/signup";

    // If  NOT logged in, and trying to access a private route, kick them to /login
    if(!isloggedIn && !isPublicRoute){
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // If logged in, but trying to go to /login or /signup, kick them to the app
    if(isloggedIn && isPublicRoute){
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    //proceed normally
    return NextResponse.next();
});

// run this middleware on every route EXCEPT static files
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}