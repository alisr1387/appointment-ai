import Link from "next/link";
import type { Lead, LeadScore, LeadStatus } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LEAD_SCORE_LABELS, LEAD_STATUS_LABELS } from "@/lib/constants";

const scoreVariant = {
  HOT: "hot",
  WARM: "warm",
  COLD: "cold",
} as const;

const statusVariant = (status: LeadStatus) => {
  if (status === "appointment_booked") return "success" as const;
  if (status === "qualified" || status === "appointment_requested")
    return "accent" as const;
  return "default" as const;
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
        <p className="text-slate-400">No leads yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Leads appear here when visitors chat with your AI assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
            <TableHead>Name</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>AI Score</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell className="font-medium text-white">
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="hover:text-accent"
                >
                  {lead.name ?? "Anonymous"}
                </Link>
              </TableCell>
              <TableCell className="text-slate-400">
                {lead.serviceInterest ?? "—"}
              </TableCell>
              <TableCell>
                {lead.score ? (
                  <Badge variant={scoreVariant[lead.score as LeadScore]}>
                    {LEAD_SCORE_LABELS[lead.score]}
                  </Badge>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(lead.status)}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
