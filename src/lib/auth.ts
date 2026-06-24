import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/lib/auth.config";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            memberships: {
              include: { workspace: true },
              take: 1,
            },
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await bcrypt.compare(
          String(credentials.password),
          user.passwordHash
        );

        if (!valid) {
          return null;
        }

        const workspace = user.memberships[0]?.workspace;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          workspaceId: workspace?.id,
          onboardingComplete: workspace?.onboardingComplete ?? false,
        };
      },
    }),
  ],
});

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user;
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
  return user;
}
