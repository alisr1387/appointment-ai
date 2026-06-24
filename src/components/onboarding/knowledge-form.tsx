"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { saveKnowledgeAction } from "@/actions/onboarding";
import { updateKnowledgeSettingsAction } from "@/actions/settings";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FaqItem = { question: string; answer: string };

export function KnowledgeForm({
  defaultValues,
  settingsMode = false,
}: {
  defaultValues: {
    faq: FaqItem[];
    policies: string;
    workingHours: string;
    knowledgeNotes: string;
  };
  settingsMode?: boolean;
}) {
  const router = useRouter();
  const [faq, setFaq] = useState<FaqItem[]>(
    defaultValues.faq.length > 0
      ? defaultValues.faq
      : [{ question: "", answer: "" }]
  );
  const [policies, setPolicies] = useState(defaultValues.policies);
  const [workingHours, setWorkingHours] = useState(defaultValues.workingHours);
  const [knowledgeNotes, setKnowledgeNotes] = useState(
    defaultValues.knowledgeNotes
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const action = settingsMode ? updateKnowledgeSettingsAction : saveKnowledgeAction;
    const result = await action({
      faq: faq.filter((f) => f.question && f.answer),
      policies,
      workingHours,
      knowledgeNotes,
    });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (settingsMode) {
      setLoading(false);
      return;
    }
    router.push("/onboarding/complete");
  }

  return (
    <>
      {!settingsMode && <OnboardingProgress currentStep={5} />}
      {!settingsMode && (
        <>
          <h1 className="mb-2 text-2xl font-bold text-white">AI knowledge setup</h1>
          <p className="mb-8 text-sm text-slate-400">
            This information powers your AI assistant when qualifying visitors.
          </p>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label>Working hours</Label>
          <Textarea
            value={workingHours}
            onChange={(e) => setWorkingHours(e.target.value)}
            placeholder="Mon-Fri 9am-6pm, Sat 10am-4pm"
          />
        </div>
        <div className="space-y-2">
          <Label>Policies</Label>
          <Textarea
            value={policies}
            onChange={(e) => setPolicies(e.target.value)}
            placeholder="Cancellation policy, consultation requirements..."
          />
        </div>
        <div className="space-y-4">
          <Label>FAQ</Label>
          {faq.map((item, index) => (
            <div key={index} className="space-y-2 rounded-lg border border-white/10 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Question {index + 1}</span>
                {faq.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFaq((prev) => prev.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input
                value={item.question}
                onChange={(e) =>
                  setFaq((prev) =>
                    prev.map((f, i) =>
                      i === index ? { ...f, question: e.target.value } : f
                    )
                  )
                }
                placeholder="Common question"
              />
              <Textarea
                value={item.answer}
                onChange={(e) =>
                  setFaq((prev) =>
                    prev.map((f, i) =>
                      i === index ? { ...f, answer: e.target.value } : f
                    )
                  )
                }
                placeholder="Answer"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFaq((prev) => [...prev, { question: "", answer: "" }])}
          >
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Additional notes for AI</Label>
          <Textarea
            value={knowledgeNotes}
            onChange={(e) => setKnowledgeNotes(e.target.value)}
            placeholder="Pricing notes, common customer questions, special offers..."
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : settingsMode ? "Save knowledge" : "Continue"}
        </Button>
      </form>
    </>
  );
}
