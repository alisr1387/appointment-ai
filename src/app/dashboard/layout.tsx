import { DashboardSidebar, MobileNav } from "@/components/dashboard/sidebar";
import { requireDashboardAccess } from "@/lib/workspace";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspace } = await requireDashboardAccess();

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar businessName={workspace.name} />
      <div className="flex flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
