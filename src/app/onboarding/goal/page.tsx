import { GoalForm } from "@/components/onboarding/goal-form";
import { requireOnboardingAccess } from "@/lib/workspace";

export default async function GoalOnboardingPage() {
  await requireOnboardingAccess();
  return <GoalForm />;
}
