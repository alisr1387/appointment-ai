"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { saveServicesAction } from "@/actions/onboarding";
import { updateServicesSettingsAction } from "@/actions/settings";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ServiceItem = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

export function ServicesForm({
  defaultServices,
  settingsMode = false,
}: {
  defaultServices: ServiceItem[];
  settingsMode?: boolean;
}) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(
    defaultServices.length > 0
      ? defaultServices
      : [{ name: "", description: "", price: "", duration: "" }]
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateService(index: number, field: keyof ServiceItem, value: string) {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function addService() {
    setServices((prev) => [
      ...prev,
      { name: "", description: "", price: "", duration: "" },
    ]);
  }

  function removeService(index: number) {
    setServices((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const action = settingsMode ? updateServicesSettingsAction : saveServicesAction;
    const result = await action({ services });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (settingsMode) {
      setLoading(false);
      return;
    }
    router.push("/onboarding/goal");
  }

  return (
    <>
      {!settingsMode && <OnboardingProgress currentStep={3} />}
      {!settingsMode && (
        <>
          <h1 className="mb-2 text-2xl font-bold text-white">Services setup</h1>
          <p className="mb-8 text-sm text-slate-400">
            Add the treatments and services your AI will recommend to visitors.
          </p>
        </>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {services.map((service, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-white">Service {index + 1}</h3>
              {services.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Service name</Label>
              <Input
                value={service.name}
                onChange={(e) => updateService(index, "name", e.target.value)}
                placeholder="e.g. Laser treatment"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) =>
                  updateService(index, "description", e.target.value)
                }
                placeholder="e.g. Hair removal treatment"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Price (optional)</Label>
                <Input
                  value={service.price}
                  onChange={(e) => updateService(index, "price", e.target.value)}
                  placeholder="e.g. $150"
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (optional)</Label>
                <Input
                  value={service.duration}
                  onChange={(e) =>
                    updateService(index, "duration", e.target.value)
                  }
                  placeholder="e.g. 45 min"
                />
              </div>
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addService}>
          <Plus className="h-4 w-4" />
          Add another service
        </Button>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : settingsMode ? "Save services" : "Continue"}
        </Button>
      </form>
    </>
  );
}
