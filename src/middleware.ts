import { UserRole } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== UserRole.ADMIN) {
        return Response.redirect(new URL('/', req.nextUrl));
      }
    }
    if (req.nextUrl.pathname.startsWith('/lender')) {
      if (req.nextauth.token?.role !== UserRole.LENDER) {
        return Response.redirect(new URL('/', req.nextUrl));
      }
    }
    if (req.nextUrl.pathname.startsWith('/agent')) {
      if (req.nextauth.token?.role !== UserRole.AGENT) {
        return Response.redirect(new URL('/', req.nextUrl));
      }
    }
  },
  {
    callbacks: {
      authorized: async ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login"
    }
  }
);

export const config = {
  matcher: [
    "/profile",
    "/admin/:path*",
    "/applications/:path*",
    "/apply/mortgage",
    "/apply/general",
    "/lender/dashboard",
    "/lender/applications",
  ],
};
