"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck } from "lucide-react";

import { saveGoalAction } from "@/actions/onboarding";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONVERSION_GOAL_LABELS } from "@/lib/constants";

export function GoalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    await saveGoalAction("book_appointment");
    router.push("/onboarding/knowledge");
  }

  return (
    <>
      <OnboardingProgress currentStep={4} />
      <h1 className="mb-2 text-2xl font-bold text-white">Conversion goal</h1>
      <p className="mb-8 text-sm text-slate-400">
        What result do you want from your visitors?
      </p>
      <div className="space-y-4">
        <Card className="border-accent/40 bg-accent/10">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <CalendarCheck className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {CONVERSION_GOAL_LABELS.book_appointment}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                AI qualifies visitors and helps them request an appointment.
              </p>
            </div>
          </CardContent>
        </Card>
        {(["get_leads", "receive_orders", "book_calls"] as const).map((goal) => (
          <Card key={goal} className="opacity-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-white">
                {CONVERSION_GOAL_LABELS[goal]}
              </h3>
              <p className="mt-1 text-sm text-slate-400">Coming soon</p>
            </CardContent>
          </Card>
        ))}
        <Button onClick={handleContinue} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </>
  );
}
