import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/onboarding");

      if (isProtected && !isLoggedIn) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.workspaceId = user.workspaceId;
        token.onboardingComplete = user.onboardingComplete;
      }

      if (trigger === "update" && session) {
        token.workspaceId = session.workspaceId ?? token.workspaceId;
        token.onboardingComplete =
          session.onboardingComplete ?? token.onboardingComplete;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.workspaceId = token.workspaceId as string | undefined;
        session.user.onboardingComplete = token.onboardingComplete as
          | boolean
          | undefined;
      }
      return session;
    },
  },
  providers: [],
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
