import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getDashboardMetrics,
  getRecentActivities,
  getVisitorTrend,
} from "@/lib/dashboard";
import { requireDashboardAccess } from "@/lib/workspace";
import { TrendChart } from "@/components/dashboard/trend-chart";

export default async function DashboardOverviewPage() {
  const { workspace } = await requireDashboardAccess();
  const [metrics, activities, trend] = await Promise.all([
    getDashboardMetrics(workspace.id),
    getRecentActivities(workspace.id),
    getVisitorTrend(workspace.id),
  ]);

  const statCards = [
    { label: "Visitors", value: metrics.visitors.toString() },
    { label: "AI Conversations", value: metrics.conversations.toString() },
    { label: "Leads Generated", value: metrics.leads.toString() },
    { label: "Appointments", value: metrics.appointments.toString() },
    { label: "Conversion Rate", value: `${metrics.conversionRate}%` },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-400">Last 30 days performance</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="hot">{metrics.hotLeads} HOT</Badge>
        <Badge variant="warm">{metrics.warmLeads} WARM</Badge>
        <Badge variant="cold">{metrics.coldLeads} COLD</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-white">Visitor trend</h2>
            <TrendChart data={trend} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 font-semibold text-white">Recent activity</h2>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500">
                No activity yet. Share your conversion page to get started.
              </p>
            ) : (
              <ul className="space-y-3">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-slate-300">{activity.title}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
