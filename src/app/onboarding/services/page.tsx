import { prisma } from "@/lib/db";
import { requireOnboardingAccess } from "@/lib/workspace";
import { ServicesForm } from "@/components/onboarding/services-form";

export default async function ServicesOnboardingPage() {
  const { workspace } = await requireOnboardingAccess();

  const services = await prisma.service.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <ServicesForm
      defaultServices={services.map((s) => ({
        name: s.name,
        description: s.description ?? "",
        price: s.price ?? "",
        duration: s.duration ?? "",
      }))}
    />
  );
}
