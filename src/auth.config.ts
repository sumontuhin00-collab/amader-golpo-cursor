import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isProtected =
        pathname === "/profile" ||
        pathname.startsWith("/profile/edit") ||
        ["/dashboard", "/create", "/admin"].some(
          (route) => pathname === route || pathname.startsWith(`${route}/`)
        );
      const isAuthRoute = ["/login", "/register"].some((route) =>
        pathname.startsWith(route)
      );
      const isAdminRoute = pathname.startsWith("/admin");

      if (isProtected && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
        return Response.redirect(
          new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
        );
      }

      if (isAdminRoute && isLoggedIn && auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
