import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "./lib/validations/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },

  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const isSafe = LoginSchema.safeParse(credentials);

        if (isSafe.success) {
          console.log("PARSED:", isSafe);
          const { identifier, password } = isSafe.data;
          console.log("IDENTIFIER:", identifier);
          const user = await prisma.user.findFirst({
            where: { OR: [{ email: identifier }, { username: identifier }] },
          });

          console.log("USER FOUND:", user);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("PASSWORD MATCH:", passwordsMatch);
          if (passwordsMatch) {
            return { id: user.id, name: user.username, email: user.email };
          }
        }
    
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
