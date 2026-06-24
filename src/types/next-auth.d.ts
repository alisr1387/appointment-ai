import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      workspaceId?: string;
      onboardingComplete?: boolean;
    };
  }

  interface User {
    workspaceId?: string;
    onboardingComplete?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    workspaceId?: string;
    onboardingComplete?: boolean;
  }
}
