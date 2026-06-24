import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getOnboardingPath, getUserWorkspace } from "@/lib/workspace";

export default async function DashboardIndexPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const workspace = await getUserWorkspace(session.user.id);
  if (!workspace) {
    redirect("/signup");
  }

  if (!workspace.onboardingComplete) {
    redirect(getOnboardingPath(workspace.onboardingStep));
  }

  redirect("/dashboard/overview");
}
