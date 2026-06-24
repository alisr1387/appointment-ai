import { SettingsTabs } from "@/components/dashboard/settings-tabs";
import { prisma } from "@/lib/db";
import { requireDashboardAccess } from "@/lib/workspace";

export default async function SettingsPage() {
  const { workspace } = await requireDashboardAccess();

  const fullWorkspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspace.id },
    include: { services: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400">
          Manage your business profile, services, and AI knowledge
        </p>
      </div>
      <SettingsTabs workspace={fullWorkspace} />
    </div>
  );
}
