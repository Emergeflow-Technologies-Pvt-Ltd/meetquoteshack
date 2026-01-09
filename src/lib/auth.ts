import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions, DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { UserRole } from "@prisma/client";
import { compare } from "bcrypt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      hasSeenFreeTrialModal: boolean;
      freeTierEndsAt: Date | null;
    };
  }
}

const LOANEE_FREE_TIER_DAYS = 90;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Lender Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,

   events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.LOANEE,
          freeTierEndsAt: new Date(
            Date.now() + LOANEE_FREE_TIER_DAYS * 24 * 60 * 60 * 1000
          ),
          hasSeenFreeTrialModal: false,
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Only handle Google OAuth
      // if (account?.provider === "google" && user.email) {
      //   const dbUser = await prisma.user.findUnique({
      //     where: { email: user.email },
      //     select: {
      //       id: true,
      //       role: true,
      //       freeTierEndsAt: true,
      //     },
      //   });

      //   if (!dbUser) return true;

      //   // 1️⃣ Assign role if missing (CRITICAL)
      //   if (!dbUser.role) {
      //     await prisma.user.update({
      //       where: { id: dbUser.id },
      //       data: { role: UserRole.LOANEE },
      //     });
      //   }

      //   // 2️⃣ Set free tier ONCE
      //   if (!dbUser.freeTierEndsAt) {
      //     await prisma.user.update({
      //       where: { id: dbUser.id },
      //       data: {
      //         freeTierEndsAt: new Date(
      //           Date.now() + LOANEE_FREE_TIER_DAYS * 24 * 60 * 60 * 1000
      //         ),
      //         hasSeenFreeTrialModal: false,
      //       },
      //     });
      //   }
      // }

      return true;
    },

    jwt: async ({ token, account, user }) => {
      if (account && user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true },
        });

        token.id = dbUser?.id;
        token.role = dbUser?.role;
      }
      return token;
    },

    session: async ({ session, token }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: {
          role: true,
          hasSeenFreeTrialModal: true,
          freeTierEndsAt: true,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: dbUser?.role as UserRole,
          hasSeenFreeTrialModal: dbUser?.hasSeenFreeTrialModal ?? false,
          freeTierEndsAt: dbUser?.freeTierEndsAt ?? null,

        },
      };
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
};
