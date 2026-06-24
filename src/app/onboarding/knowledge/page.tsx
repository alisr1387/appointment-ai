import { requireOnboardingAccess } from "@/lib/workspace";
import { KnowledgeForm } from "@/components/onboarding/knowledge-form";

export default async function KnowledgeOnboardingPage() {
  const { workspace } = await requireOnboardingAccess();

  const faq = (workspace.faq as { question: string; answer: string }[]) ?? [];

  return (
    <KnowledgeForm
      defaultValues={{
        faq,
        policies: workspace.policies ?? "",
        workingHours: workspace.workingHours ?? "",
        knowledgeNotes: workspace.knowledgeNotes ?? "",
      }}
    />
  );
}
