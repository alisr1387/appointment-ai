"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { logActivity, requireDashboardAccess } from "@/lib/workspace";

export type ActionResult = { error?: string; success?: boolean };

export async function confirmAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  const { workspace } = await requireDashboardAccess();

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, workspaceId: workspace.id },
    include: { lead: true },
  });

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "confirmed",
        confirmedAt: new Date(),
      },
    }),
    prisma.lead.update({
      where: { id: appointment.leadId },
      data: { status: "appointment_booked" },
    }),
  ]);

  await logActivity(
    workspace.id,
    "appointment_confirmed",
    `Appointment confirmed — ${appointment.lead.name ?? "Lead"}`,
    { leadId: appointment.leadId, appointmentId }
  );

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function cancelAppointmentAction(
  appointmentId: string
): Promise<ActionResult> {
  const { workspace } = await requireDashboardAccess();

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, workspaceId: workspace.id },
    include: { lead: true },
  });

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  await prisma.$transaction([
    prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "cancelled" },
    }),
    prisma.lead.update({
      where: { id: appointment.leadId },
      data: { status: "qualified" },
    }),
  ]);

  revalidatePath("/dashboard/appointments");
  revalidatePath("/dashboard/leads");
  return { success: true };
}

export async function rescheduleAppointmentAction(
  appointmentId: string,
  preferredAtText: string,
  preferredAt?: string
): Promise<ActionResult> {
  const { workspace } = await requireDashboardAccess();

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, workspaceId: workspace.id },
  });

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      preferredAtText,
      preferredAt: preferredAt ? new Date(preferredAt) : null,
      status: "requested",
    },
  });

  revalidatePath("/dashboard/appointments");
  return { success: true };
}
