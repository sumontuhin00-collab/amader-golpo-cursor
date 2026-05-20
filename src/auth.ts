import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { authConfig } from "@/auth.config";
import { ensureUserUsername, generateUniqueUsername } from "@/lib/username";
import type { Role } from "@prisma/client";

function createAdapter(): Adapter {
  const base = PrismaAdapter(prisma);
  return {
    ...base,
    async createUser(user) {
      const username = await generateUniqueUsername(user.name, user.email);
      return base.createUser!({
        ...user,
        username,
      } as Parameters<NonNullable<Adapter["createUser"]>>[0]);
    },
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
    username?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    username?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  adapter: createAdapter(),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        if (user.username) token.username = user.username;
      }

      if (token.id && !token.username) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { username: true },
        });
        if (dbUser?.username) {
          token.username = dbUser.username;
        } else {
          token.username = await ensureUserUsername(token.id as string);
        }
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
        if (session.username) token.username = session.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.password
        );
        if (!valid) return null;

        const username = user.username || (await ensureUserUsername(user.id));

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          username,
        };
      },
    }),
  ],
});
