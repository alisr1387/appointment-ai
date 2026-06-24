import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ONBOARDING_STEPS } from "@/lib/constants";

export async function getUserWorkspace(userId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: {
          services: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  return membership?.workspace ?? null;
}

export async function requireWorkspace() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const workspace = await getUserWorkspace(session.user.id);
  if (!workspace) {
    redirect("/signup");
  }

  return { user: session.user, workspace };
}

export function getOnboardingPath(step: number) {
  const match = ONBOARDING_STEPS.find((s) => s.step === step);
  return match?.path ?? "/onboarding/business";
}

export async function requireOnboardingAccess() {
  const { user, workspace } = await requireWorkspace();

  if (workspace.onboardingComplete) {
    redirect("/dashboard");
  }

  return { user, workspace };
}

export async function requireDashboardAccess() {
  const { user, workspace } = await requireWorkspace();

  if (!workspace.onboardingComplete) {
    redirect(getOnboardingPath(workspace.onboardingStep));
  }

  return { user, workspace };
}

export async function logActivity(
  workspaceId: string,
  type:
    | "visitor"
    | "conversation"
    | "lead_created"
    | "score_changed"
    | "appointment_requested"
    | "appointment_confirmed"
    | "follow_up_sent",
  title: string,
  metadata?: Prisma.InputJsonValue
) {
  await prisma.activity.create({
    data: {
      workspaceId,
      type,
      title,
      metadata,
    },
  });
}
