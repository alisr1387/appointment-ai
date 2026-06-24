import { redirect } from "next/navigation";

import { requireOnboardingAccess, getOnboardingPath } from "@/lib/workspace";

export default async function OnboardingIndexPage() {
  const { workspace } = await requireOnboardingAccess();
  redirect(getOnboardingPath(workspace.onboardingStep));
}
