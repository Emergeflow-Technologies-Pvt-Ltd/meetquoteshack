import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextUrl.pathname, ' *************');
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
    "/become-lender",
  ],
};
