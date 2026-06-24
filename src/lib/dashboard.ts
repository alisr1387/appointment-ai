import { prisma } from "@/lib/db";

function subDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export async function getDashboardMetrics(workspaceId: string, days = 30) {
  const since = subDays(new Date(), days);

  const [
    visitors,
    conversations,
    leads,
    hotLeads,
    warmLeads,
    coldLeads,
    appointments,
  ] = await Promise.all([
    prisma.visitorSession.count({
      where: { workspaceId, createdAt: { gte: since } },
    }),
    prisma.visitorSession.count({
      where: {
        workspaceId,
        createdAt: { gte: since },
        messages: { some: {} },
      },
    }),
    prisma.lead.count({
      where: {
        workspaceId,
        createdAt: { gte: since },
        OR: [{ name: { not: null } }, { email: { not: null } }, { phone: { not: null } }],
      },
    }),
    prisma.lead.count({
      where: { workspaceId, score: "HOT", createdAt: { gte: since } },
    }),
    prisma.lead.count({
      where: { workspaceId, score: "WARM", createdAt: { gte: since } },
    }),
    prisma.lead.count({
      where: { workspaceId, score: "COLD", createdAt: { gte: since } },
    }),
    prisma.lead.count({
      where: {
        workspaceId,
        status: "appointment_booked",
        updatedAt: { gte: since },
      },
    }),
  ]);

  const conversionRate =
    visitors > 0 ? Number(((appointments / visitors) * 100).toFixed(1)) : 0;

  return {
    visitors,
    conversations,
    leads,
    hotLeads,
    warmLeads,
    coldLeads,
    appointments,
    conversionRate,
  };
}

export async function getRecentActivities(workspaceId: string, limit = 10) {
  return prisma.activity.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getVisitorTrend(workspaceId: string, days = 12) {
  const since = subDays(new Date(), days);
  const sessions = await prisma.visitorSession.findMany({
    where: { workspaceId, createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets: number[] = Array(days).fill(0);
  const now = new Date();

  for (const session of sessions) {
    const diff = Math.floor(
      (now.getTime() - session.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    const index = days - 1 - diff;
    if (index >= 0 && index < days) {
      buckets[index] += 1;
    }
  }

  return buckets;
}
