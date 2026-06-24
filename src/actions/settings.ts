"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";
import {
  businessInfoSchema,
  knowledgeSchema,
  servicesSchema,
  type BusinessInfoInput,
  type KnowledgeInput,
  type ServicesInput,
} from "@/lib/validations/onboarding";

export type ActionResult = { error?: string; success?: boolean };

export async function updateBusinessProfileAction(
  data: BusinessInfoInput
): Promise<ActionResult> {
  const parsed = businessInfoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { workspace } = await requireDashboardAccess();

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      name: parsed.data.name,
      logoUrl: parsed.data.logoUrl || null,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      phone: parsed.data.phone || null,
      website: parsed.data.website || null,
      socialLinks: parsed.data.socialLinks ?? undefined,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/b/${workspace.slug}`);
  return { success: true };
}

export async function updateServicesSettingsAction(
  data: ServicesInput
): Promise<ActionResult> {
  const parsed = servicesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid services" };
  }

  const { workspace } = await requireDashboardAccess();

  await prisma.$transaction([
    prisma.service.deleteMany({ where: { workspaceId: workspace.id } }),
    prisma.service.createMany({
      data: parsed.data.services.map((service, index) => ({
        workspaceId: workspace.id,
        name: service.name,
        description: service.description || null,
        price: service.price || null,
        duration: service.duration || null,
        sortOrder: index,
      })),
    }),
  ]);

  revalidatePath("/dashboard/settings");
  revalidatePath(`/b/${workspace.slug}`);
  return { success: true };
}

export async function updateKnowledgeSettingsAction(
  data: KnowledgeInput
): Promise<ActionResult> {
  const parsed = knowledgeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid knowledge" };
  }

  const { workspace } = await requireDashboardAccess();

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      faq: parsed.data.faq,
      policies: parsed.data.policies || null,
      workingHours: parsed.data.workingHours || null,
      knowledgeNotes: parsed.data.knowledgeNotes || null,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath(`/b/${workspace.slug}`);
  return { success: true };
}
