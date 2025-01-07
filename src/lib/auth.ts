import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, account, user }) => {
      const dbuser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
        select: {
          role: true,
        },
      });
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
        token.role = dbuser?.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          role: token.role,
          id: token.sub,
        },
      };
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
};
