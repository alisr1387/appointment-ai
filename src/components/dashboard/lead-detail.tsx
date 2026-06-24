"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Lead, Message, Appointment } from "@prisma/client";

import {
  markFollowUpAction,
  markLostAction,
  updateLeadAction,
  updateLeadStatusAction,
} from "@/actions/leads";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { LEAD_SCORE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants";

type LeadWithRelations = Lead & {
  messages: Message[];
  appointment: Appointment | null;
};

export function LeadDetail({ lead }: { lead: LeadWithRelations }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    serviceInterest: lead.serviceInterest ?? "",
    status: lead.status,
  });

  async function handleSave() {
    setLoading(true);
    await updateLeadAction(lead.id, form);
    setLoading(false);
    router.refresh();
  }

  async function handleStatusChange(status: Lead["status"]) {
    setLoading(true);
    await updateLeadStatusAction(lead.id, status);
    setForm((f) => ({ ...f, status }));
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-white">
          {lead.name ?? "Anonymous lead"}
        </h1>
        {lead.score && (
          <Badge
            variant={
              lead.score === "HOT"
                ? "hot"
                : lead.score === "WARM"
                  ? "warm"
                  : "cold"
            }
          >
            {LEAD_SCORE_LABELS[lead.score]}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold text-white">Contact info</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Service interest</Label>
                <Input
                  value={form.serviceInterest}
                  onChange={(e) =>
                    setForm({ ...form, serviceInterest: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as Lead["status"])
                  }
                >
                  {Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
              <Button onClick={handleSave} disabled={loading}>
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold text-white">AI assessment</h2>
            {lead.scoreNumeric != null && (
              <p className="text-sm text-slate-400">
                Score: {lead.scoreNumeric}/100
              </p>
            )}
            <p className="text-sm text-slate-300">
              {lead.scoreReasoning ?? "No reasoning recorded yet."}
            </p>
            {lead.appointment && (
              <div className="rounded-lg border border-white/10 p-4">
                <p className="text-sm font-medium text-white">Appointment request</p>
                <p className="mt-1 text-sm text-slate-400">
                  {lead.appointment.preferredAtText ??
                    (lead.appointment.preferredAt
                      ? new Date(lead.appointment.preferredAt).toLocaleString()
                      : "No time specified")}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  await markFollowUpAction(lead.id);
                  setLoading(false);
                  router.refresh();
                }}
              >
                Send follow-up
              </Button>
              <Button
                variant="ghost"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  await markLostAction(lead.id);
                  setLoading(false);
                  router.refresh();
                }}
              >
                Mark lost
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 font-semibold text-white">Conversation history</h2>
          {lead.messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {lead.messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-4 text-sm ${
                    message.role === "user"
                      ? "ml-8 bg-white/5 text-slate-300"
                      : "mr-8 bg-accent/10 text-slate-200"
                  }`}
                >
                  <p className="mb-1 text-xs font-medium uppercase text-slate-500">
                    {message.role}
                  </p>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
