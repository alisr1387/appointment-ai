"use server";

import { revalidatePath } from "next/cache";
import type { LeadStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logActivity, requireDashboardAccess } from "@/lib/workspace";

export type ActionResult = { error?: string; success?: boolean };

export async function updateLeadStatusAction(
  leadId: string,
  status: LeadStatus
): Promise<ActionResult> {
  const { workspace } = await requireDashboardAccess();

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, workspaceId: workspace.id },
  });

  if (!lead) {
    return { error: "Lead not found" };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { status },
  });

  if (status === "follow_up_sent") {
    await logActivity(workspace.id, "follow_up_sent", `Follow-up sent — ${lead.name ?? "Lead"}`, {
      leadId,
    });
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  return { success: true };
}

export async function updateLeadAction(
  leadId: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    serviceInterest?: string;
    status?: LeadStatus;
  }
): Promise<ActionResult> {
  const { workspace } = await requireDashboardAccess();

  const lead = await prisma.lead.findFirst({
    where: { id: leadId, workspaceId: workspace.id },
  });

  if (!lead) {
    return { error: "Lead not found" };
  }

  await prisma.lead.update({
    where: { id: leadId },
    data,
  });

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);
  return { success: true };
}

export async function markFollowUpAction(leadId: string): Promise<ActionResult> {
  return updateLeadStatusAction(leadId, "follow_up_sent");
}

export async function markLostAction(leadId: string): Promise<ActionResult> {
  return updateLeadStatusAction(leadId, "lost");
}
