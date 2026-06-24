"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export function LeadsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard/leads?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div className="space-y-1">
        <Label>Score</Label>
        <Select
          value={searchParams.get("score") ?? ""}
          onChange={(e) => updateFilter("score", e.target.value)}
        >
          <option value="">All scores</option>
          <option value="HOT">HOT</option>
          <option value="WARM">WARM</option>
          <option value="COLD">COLD</option>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Status</Label>
        <Select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All statuses</option>
          {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
