"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";

import { completeOnboardingAction } from "@/actions/onboarding";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";

export function CompleteOnboarding({
  slug,
  businessName,
}: {
  slug: string;
  businessName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/b/${slug}`
      : `/b/${slug}`;

  async function handlePublish() {
    setLoading(true);
    setError(null);
    const result = await completeOnboardingAction();
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <OnboardingProgress currentStep={6} />
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 ring-1 ring-emerald-500/30">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">
          Your AI conversion system is ready
        </h1>
        <p className="mb-8 text-sm text-slate-400">
          {businessName} is set up. Share your conversion page with visitors.
        </p>
      </div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="mb-2 text-sm text-slate-400">Your public page</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate rounded-lg bg-black/30 px-3 py-2 text-sm text-accent">
            /b/{slug}
          </code>
          <Button type="button" variant="secondary" size="icon" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button type="button" variant="secondary" size="icon" asChild>
            <Link href={`/b/${slug}`} target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <Button onClick={handlePublish} disabled={loading} className="w-full glow-indigo">
        {loading ? "Publishing..." : "Go to Dashboard"}
      </Button>
    </>
  );
}
