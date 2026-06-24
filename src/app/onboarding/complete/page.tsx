import { requireOnboardingAccess } from "@/lib/workspace";
import { CompleteOnboarding } from "@/components/onboarding/complete-onboarding";

export default async function CompleteOnboardingPage() {
  const { workspace } = await requireOnboardingAccess();

  return (
    <CompleteOnboarding slug={workspace.slug} businessName={workspace.name} />
  );
}
