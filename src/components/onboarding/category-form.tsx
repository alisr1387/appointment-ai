"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveCategoryAction } from "@/actions/onboarding";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORY_LABELS } from "@/lib/constants";

export function CategoryForm({
  defaultCategory,
}: {
  defaultCategory?: "skin_beauty_clinic" | null;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<"skin_beauty_clinic" | null>(
    defaultCategory ?? "skin_beauty_clinic"
  );
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    await saveCategoryAction(selected);
    router.push("/onboarding/services");
  }

  return (
    <>
      <OnboardingProgress currentStep={2} />
      <h1 className="mb-2 text-2xl font-bold text-white">Business category</h1>
      <p className="mb-8 text-sm text-slate-400">
        Choose your industry. More categories coming soon.
      </p>
      <div className="space-y-4">
        <Card
          className={`cursor-pointer transition-all ${
            selected === "skin_beauty_clinic"
              ? "border-accent/40 bg-accent/10"
              : "hover:border-white/20"
          }`}
          onClick={() => setSelected("skin_beauty_clinic")}
        >
          <CardContent className="p-6">
            <h3 className="font-semibold text-white">
              {CATEGORY_LABELS.skin_beauty_clinic}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Laser treatments, botox, skin rejuvenation, and aesthetic services.
            </p>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-white">More categories</h3>
            <p className="mt-1 text-sm text-slate-400">Coming soon</p>
          </CardContent>
        </Card>
        <Button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </>
  );
}
