import { requireOnboardingAccess } from "@/lib/workspace";
import { BusinessInfoForm } from "@/components/onboarding/business-info-form";

export default async function BusinessOnboardingPage() {
  const { workspace } = await requireOnboardingAccess();

  const socialLinks = (workspace.socialLinks as {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  }) ?? {};

  return (
    <BusinessInfoForm
      defaultValues={{
        name: workspace.name,
        logoUrl: workspace.logoUrl ?? "",
        description: workspace.description ?? "",
        location: workspace.location ?? "",
        phone: workspace.phone ?? "",
        website: workspace.website ?? "",
        socialLinks,
        slug: workspace.slug,
      }}
    />
  );
}
