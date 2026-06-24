import { AppointmentsTable } from "@/components/dashboard/appointments-table";
import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";

export default async function AppointmentsPage() {
  const { workspace } = await requireDashboardAccess();

  const appointments = await prisma.appointment.findMany({
    where: { workspaceId: workspace.id },
    include: { lead: true },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Appointments</h1>
        <p className="text-sm text-slate-400">
          Review and confirm appointment requests from qualified leads
        </p>
      </div>
      <AppointmentsTable appointments={appointments} />
    </div>
  );
}
