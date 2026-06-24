import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";
import { LEAD_SCORE_LABELS } from "@/lib/constants";

export default async function ConversationsPage() {
  const { workspace } = await requireDashboardAccess();

  const sessions = await prisma.visitorSession.findMany({
    where: { workspaceId: workspace.id },
    include: {
      lead: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Conversations</h1>
        <p className="text-sm text-slate-400">
          All AI conversations with your visitors
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <p className="text-slate-400">No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const lastMessage = session.messages[0];
            const href = session.leadId
              ? `/dashboard/leads/${session.leadId}`
              : "#";

            return (
              <Link key={session.id} href={href}>
                <Card className="transition-colors hover:border-white/20">
                  <CardContent className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {session.lead?.name ?? "Anonymous visitor"}
                        </p>
                        {session.lead?.score && (
                          <Badge
                            variant={
                              session.lead.score === "HOT"
                                ? "hot"
                                : session.lead.score === "WARM"
                                  ? "warm"
                                  : "cold"
                            }
                          >
                            {LEAD_SCORE_LABELS[session.lead.score]}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-400">
                        {lastMessage?.content ?? "No messages"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-slate-500">
                      <p>{session._count.messages} messages</p>
                      <p>{new Date(session.updatedAt).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
