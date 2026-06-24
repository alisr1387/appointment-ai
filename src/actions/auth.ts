"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateUniqueSlug } from "@/lib/slug";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";

export type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function signupAction(data: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password, businessName } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const slug = await generateUniqueSlug(businessName, async (candidate) => {
    const found = await prisma.workspace.findUnique({ where: { slug: candidate } });
    return !!found;
  });

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      memberships: {
        create: {
          role: "owner",
          workspace: {
            create: {
              name: businessName,
              slug,
              onboardingStep: 1,
            },
          },
        },
      },
    },
    include: {
      memberships: { include: { workspace: true } },
    },
  });

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });
  } catch {
    // signIn may throw on redirect; user is created
  }

  const workspace = user.memberships[0]?.workspace;
  if (!workspace) {
    return { error: "Failed to create workspace" };
  }

  redirect("/onboarding/business");
}

export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase().trim(),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }
    throw error;
  }

  return { success: true };
}

export async function logoutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
