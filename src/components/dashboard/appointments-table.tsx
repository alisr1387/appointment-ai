"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Appointment, Lead } from "@prisma/client";

import {
  cancelAppointmentAction,
  confirmAppointmentAction,
  rescheduleAppointmentAction,
} from "@/actions/appointments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AppointmentWithLead = Appointment & { lead: Lead };

const statusLabels = {
  requested: "Requested",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

export function AppointmentsTable({
  appointments,
}: {
  appointments: AppointmentWithLead[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleText, setRescheduleText] = useState("");

  async function handleConfirm(id: string) {
    setLoadingId(id);
    await confirmAppointmentAction(id);
    setLoadingId(null);
    router.refresh();
  }

  async function handleCancel(id: string) {
    setLoadingId(id);
    await cancelAppointmentAction(id);
    setLoadingId(null);
    router.refresh();
  }

  async function handleReschedule(id: string) {
    setLoadingId(id);
    await rescheduleAppointmentAction(id, rescheduleText);
    setRescheduleId(null);
    setRescheduleText("");
    setLoadingId(null);
    router.refresh();
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
        <p className="text-slate-400">No appointment requests yet</p>
        <p className="mt-1 text-sm text-slate-500">
          When HOT or WARM leads request a time, they appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 bg-white/[0.02] hover:bg-white/[0.02]">
            <TableHead>Lead</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Preferred time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell className="font-medium text-white">
                {appointment.lead.name ?? "Anonymous"}
              </TableCell>
              <TableCell className="text-slate-400">
                {appointment.lead.serviceInterest ?? "—"}
              </TableCell>
              <TableCell className="text-slate-400">
                {appointment.preferredAtText ??
                  (appointment.preferredAt
                    ? new Date(appointment.preferredAt).toLocaleString()
                    : "—")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    appointment.status === "confirmed"
                      ? "success"
                      : appointment.status === "cancelled"
                        ? "default"
                        : "accent"
                  }
                >
                  {statusLabels[appointment.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {appointment.status === "requested" && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      disabled={loadingId === appointment.id}
                      onClick={() => handleConfirm(appointment.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={loadingId === appointment.id}
                      onClick={() => {
                        setRescheduleId(appointment.id);
                        setRescheduleText(appointment.preferredAtText ?? "");
                      }}
                    >
                      Reschedule
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loadingId === appointment.id}
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                {rescheduleId === appointment.id && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={rescheduleText}
                      onChange={(e) => setRescheduleText(e.target.value)}
                      placeholder="New preferred time"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReschedule(appointment.id)}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
