import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: Users, label: "Leads", active: true },
  { icon: MessageSquare, label: "Conversations", active: false },
  { icon: Calendar, label: "Appointments", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const leads = [
  {
    name: "Ali",
    interest: "Laser Treatment",
    score: "HOT" as const,
    status: "Appointment booked",
    statusVariant: "success" as const,
  },
  {
    name: "Sara",
    interest: "Botox Consultation",
    score: "HOT" as const,
    status: "Qualified",
    statusVariant: "accent" as const,
  },
  {
    name: "Mina",
    interest: "Skin Rejuvenation",
    score: "WARM" as const,
    status: "In conversation",
    statusVariant: "default" as const,
  },
  {
    name: "Reza",
    interest: "General Inquiry",
    score: "COLD" as const,
    status: "Nurture",
    statusVariant: "default" as const,
  },
  {
    name: "Neda",
    interest: "Chemical Peel",
    score: "WARM" as const,
    status: "Follow-up sent",
    statusVariant: "default" as const,
  },
];

const scoreVariant = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
} as const;

export function ProductDashboard() {
  return (
    <section className="py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your conversion command center
          </h2>
          <p className="mt-4 text-slate-400">
            Manage leads, conversations, and appointments from one powerful
            dashboard.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute inset-0 -z-10 mesh-bg opacity-40" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14]/90 shadow-glow-lg backdrop-blur-md">
            <div className="flex">
              <aside className="hidden w-52 shrink-0 border-r border-white/5 bg-white/[0.01] p-4 md:block">
                <div className="mb-6 flex items-center gap-2 px-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-medium text-slate-400">
                    Lumina Skin Clinic
                  </span>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                        item.active
                          ? "bg-accent/15 text-white"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  ))}
                </nav>
              </aside>

              <div className="flex-1 p-4 sm:p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Leads</h3>
                    <p className="text-sm text-slate-500">
                      342 qualified this month
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="hot">24 HOT</Badge>
                    <Badge variant="warm">89 WARM</Badge>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/5">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="px-4 py-3 font-medium text-slate-500">
                          Name
                        </th>
                        <th className="px-4 py-3 font-medium text-slate-500">
                          Interest
                        </th>
                        <th className="px-4 py-3 font-medium text-slate-500">
                          AI Score
                        </th>
                        <th className="px-4 py-3 font-medium text-slate-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr
                          key={lead.name}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3.5 font-medium text-white">
                            {lead.name}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">
                            {lead.interest}
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={scoreVariant[lead.score]}>
                              {lead.score}
                            </Badge>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge variant={lead.statusVariant}>
                              {lead.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
