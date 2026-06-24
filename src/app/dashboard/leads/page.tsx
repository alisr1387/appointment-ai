import { Suspense } from "react";

import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { Badge } from "@/components/ui/badge";
import { LeadsFilters } from "@/components/dashboard/leads-filters";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; status?: string }>;
}) {
  const { workspace } = await requireDashboardAccess();
  const params = await searchParams;

  const leads = await prisma.lead.findMany({
    where: {
      workspaceId: workspace.id,
      ...(params.score && {
        score: params.score as "HOT" | "WARM" | "COLD",
      }),
      ...(params.status && {
        status: params.status as never,
      }),
    },
    orderBy: { updatedAt: "desc" },
  });

  const counts = await Promise.all([
    prisma.lead.count({ where: { workspaceId: workspace.id, score: "HOT" } }),
    prisma.lead.count({ where: { workspaceId: workspace.id, score: "WARM" } }),
    prisma.lead.count({ where: { workspaceId: workspace.id, score: "COLD" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-slate-400">
            {leads.length} lead{leads.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="hot">{counts[0]} HOT</Badge>
          <Badge variant="warm">{counts[1]} WARM</Badge>
          <Badge variant="cold">{counts[2]} COLD</Badge>
        </div>
      </div>
      <Suspense fallback={<div className="h-10" />}>
        <LeadsFilters />
      </Suspense>
      <LeadsTable leads={leads} />
    </div>
  );
}
