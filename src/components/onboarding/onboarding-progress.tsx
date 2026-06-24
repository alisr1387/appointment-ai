import { ONBOARDING_STEPS } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

export function OnboardingProgress({ currentStep }: { currentStep: number }) {
  const progress = (currentStep / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Step {currentStep} of {ONBOARDING_STEPS.length}
        </span>
        <span className="font-medium text-white">
          {ONBOARDING_STEPS.find((s) => s.step === currentStep)?.label}
        </span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
