import { UserRole } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if(req.nextUrl.pathname.startsWith('/admin')){
      if(req.nextauth.token?.role !== UserRole.ADMIN){
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
  }
);

export const config = {
  matcher: [
    "/profile", 
    "/admin/:path*",
    "/applications/:path*",
    "/apply/mortgage",
    "/apply/general", 
  ],
};
