"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveBusinessInfoAction, uploadLogoAction } from "@/actions/onboarding";
import { updateBusinessProfileAction } from "@/actions/settings";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  businessInfoSchema,
  type BusinessInfoInput,
} from "@/lib/validations/onboarding";
import { slugify } from "@/lib/slug";

export function BusinessInfoForm({
  defaultValues,
  settingsMode = false,
}: {
  defaultValues: BusinessInfoInput & { slug?: string };
  settingsMode?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(defaultValues.logoUrl ?? "");

  const form = useForm<BusinessInfoInput>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      name: defaultValues.name ?? "",
      logoUrl: defaultValues.logoUrl ?? "",
      description: defaultValues.description ?? "",
      location: defaultValues.location ?? "",
      phone: defaultValues.phone ?? "",
      website: defaultValues.website ?? "",
      socialLinks: defaultValues.socialLinks ?? {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
    },
  });

  const watchName = form.watch("name");

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadLogoAction(formData);
    if (result.url) {
      setLogoUrl(result.url);
      form.setValue("logoUrl", result.url);
    } else if (result.error) {
      setError(result.error);
    }
  }

  async function onSubmit(data: BusinessInfoInput) {
    setLoading(true);
    setError(null);
    const action = settingsMode ? updateBusinessProfileAction : saveBusinessInfoAction;
    const result = await action({ ...data, logoUrl });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (settingsMode) {
      setLoading(false);
      return;
    }
    router.push("/onboarding/category");
  }

  return (
    <>
      {!settingsMode && <OnboardingProgress currentStep={1} />}
      {!settingsMode && (
        <>
          <h1 className="mb-2 text-2xl font-bold text-white">Business information</h1>
          <p className="mb-8 text-sm text-slate-400">
            Tell us about your clinic so we can personalize your conversion page.
          </p>
        </>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Business name</Label>
          <Input id="name" {...form.register("name")} />
          {watchName && (
            <p className="text-xs text-slate-500">
              Your page URL: /b/{slugify(watchName) || "your-business"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Logo</Label>
          <Input type="file" accept="image/*" onChange={handleLogoUpload} />
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Logo" className="mt-2 h-16 w-16 rounded-lg object-cover" />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...form.register("description")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...form.register("phone")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" placeholder="https://" {...form.register("website")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" {...form.register("socialLinks.instagram")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" {...form.register("socialLinks.facebook")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input id="tiktok" {...form.register("socialLinks.tiktok")} />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : settingsMode ? "Save profile" : "Continue"}
        </Button>
      </form>
    </>
  );
}
