import { requireOnboardingAccess } from "@/lib/workspace";
import { CategoryForm } from "@/components/onboarding/category-form";

export default async function CategoryOnboardingPage() {
  const { workspace } = await requireOnboardingAccess();
  return <CategoryForm defaultCategory={workspace.category} />;
}
