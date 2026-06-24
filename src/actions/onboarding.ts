"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { requireOnboardingAccess } from "@/lib/workspace";
import {
  businessInfoSchema,
  categorySchema,
  goalSchema,
  knowledgeSchema,
  servicesSchema,
  type BusinessInfoInput,
  type KnowledgeInput,
  type ServicesInput,
} from "@/lib/validations/onboarding";

export type ActionResult = { error?: string; success?: boolean };

export async function saveBusinessInfoAction(
  data: BusinessInfoInput
): Promise<ActionResult> {
  const parsed = businessInfoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { workspace } = await requireOnboardingAccess();
  const slug = await generateUniqueSlug(parsed.data.name, async (candidate) => {
    const found = await prisma.workspace.findFirst({
      where: { slug: candidate, NOT: { id: workspace.id } },
    });
    return !!found;
  });

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      name: parsed.data.name,
      slug,
      logoUrl: parsed.data.logoUrl || null,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      phone: parsed.data.phone || null,
      website: parsed.data.website || null,
      socialLinks: parsed.data.socialLinks ?? undefined,
      onboardingStep: Math.max(workspace.onboardingStep, 2),
    },
  });

  revalidatePath("/onboarding");
  return { success: true };
}

export async function saveCategoryAction(
  category: "skin_beauty_clinic"
): Promise<ActionResult> {
  const parsed = categorySchema.safeParse({ category });
  if (!parsed.success) {
    return { error: "Invalid category" };
  }

  const { workspace } = await requireOnboardingAccess();

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      category: parsed.data.category,
      onboardingStep: Math.max(workspace.onboardingStep, 3),
    },
  });

  return { success: true };
}

export async function saveServicesAction(
  data: ServicesInput
): Promise<ActionResult> {
  const parsed = servicesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid services" };
  }

  const { workspace } = await requireOnboardingAccess();

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
    prisma.workspace.update({
      where: { id: workspace.id },
      data: { onboardingStep: Math.max(workspace.onboardingStep, 4) },
    }),
  ]);

  return { success: true };
}

export async function saveGoalAction(
  conversionGoal: "book_appointment"
): Promise<ActionResult> {
  const parsed = goalSchema.safeParse({ conversionGoal });
  if (!parsed.success) {
    return { error: "Invalid conversion goal" };
  }

  const { workspace } = await requireOnboardingAccess();

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      conversionGoal: parsed.data.conversionGoal,
      onboardingStep: Math.max(workspace.onboardingStep, 5),
    },
  });

  return { success: true };
}

export async function saveKnowledgeAction(
  data: KnowledgeInput
): Promise<ActionResult> {
  const parsed = knowledgeSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid knowledge" };
  }

  const { workspace } = await requireOnboardingAccess();

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      faq: parsed.data.faq,
      policies: parsed.data.policies || null,
      workingHours: parsed.data.workingHours || null,
      knowledgeNotes: parsed.data.knowledgeNotes || null,
      onboardingStep: Math.max(workspace.onboardingStep, 6),
    },
  });

  return { success: true };
}

export async function completeOnboardingAction(): Promise<ActionResult> {
  const { workspace } = await requireOnboardingAccess();

  if (!workspace.category) {
    return { error: "Please select a business category" };
  }

  const serviceCount = await prisma.service.count({
    where: { workspaceId: workspace.id },
  });

  if (serviceCount === 0) {
    return { error: "Please add at least one service" };
  }

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      onboardingComplete: true,
      onboardingStep: 6,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function uploadLogoAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image" };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { error: "Image must be under 2MB" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "png";
  const filename = `${slugify(file.name.replace(/\.[^.]+$/, ""))}-${Date.now()}.${ext}`;

  const fs = await import("fs/promises");
  const path = await import("path");

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return { url: `/uploads/${filename}` };
}
