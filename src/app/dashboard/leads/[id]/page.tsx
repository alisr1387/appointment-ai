import { notFound } from "next/navigation";

import { LeadDetail } from "@/components/dashboard/lead-detail";
import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { workspace } = await requireDashboardAccess();
  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      appointment: true,
    },
  });

  if (!lead) {
    notFound();
  }

  return <LeadDetail lead={lead} />;
}
