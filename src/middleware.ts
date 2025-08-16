import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // If user is authenticated and trying to access auth pages, redirect to home
    if (
      token &&
      (pathname.startsWith("/sign-up") || pathname.startsWith("/sign-in"))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If user is not authenticated and trying to access protected pages
    // if (!token && pathname.startsWith("/dashboard")) {
    //   return NextResponse.redirect(new URL("/sign-in", req.url));
    // }
  },
  {
    callbacks: {
      authorized: () => true, // Always return true, handle logic in middleware function
    },
  },
);

export const config = {
  matcher: ["/sign-up", "/sign-in"],
};
