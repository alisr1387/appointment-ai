import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import type { LeadScore, LeadStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  buildSystemPrompt,
  parseLeadUpdate,
  stripLeadUpdate,
} from "@/lib/ai/prompt";
import { logActivity } from "@/lib/workspace";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, slug, sessionId, visitorId } = body as {
    messages: { role: string; content: string }[];
    slug: string;
    sessionId?: string;
    visitorId: string;
  };

  if (!slug || !visitorId) {
    return new Response("Missing slug or visitorId", { status: 400 });
  }

  const workspace = await prisma.workspace.findUnique({
    where: { slug, onboardingComplete: true },
    include: { services: { orderBy: { sortOrder: "asc" } } },
  });

  if (!workspace) {
    return new Response("Business not found", { status: 404 });
  }

  let visitorSession = sessionId
    ? await prisma.visitorSession.findFirst({
        where: { id: sessionId, workspaceId: workspace.id },
        include: { lead: true },
      })
    : null;

  if (!visitorSession) {
    visitorSession = await prisma.visitorSession.create({
      data: {
        workspaceId: workspace.id,
        visitorId,
      },
      include: { lead: true },
    });

    await logActivity(workspace.id, "visitor", "New visitor on conversion page");
  }

  let lead = visitorSession.lead;

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        status: "new",
      },
    });

    await prisma.visitorSession.update({
      where: { id: visitorSession.id },
      data: { leadId: lead.id },
    });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

  if (lastUserMessage) {
    await prisma.message.create({
      data: {
        workspaceId: workspace.id,
        visitorSessionId: visitorSession.id,
        leadId: lead.id,
        role: "user",
        content: lastUserMessage.content,
      },
    });

    if (lead.status === "new") {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: "in_conversation" },
      });
    }
  }

  const systemPrompt = buildSystemPrompt(workspace);

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    })),
    onFinish: async ({ text }) => {
      const leadUpdate = parseLeadUpdate(text);
      const displayText = stripLeadUpdate(text) || text;

      await prisma.message.create({
        data: {
          workspaceId: workspace.id,
          visitorSessionId: visitorSession!.id,
          leadId: lead!.id,
          role: "assistant",
          content: displayText,
        },
      });

      if (leadUpdate) {
        const updateData: {
          name?: string;
          phone?: string;
          email?: string;
          serviceInterest?: string;
          score?: LeadScore;
          scoreNumeric?: number;
          scoreReasoning?: string;
          status?: LeadStatus;
        } = {};

        if (leadUpdate.name) updateData.name = leadUpdate.name;
        if (leadUpdate.phone) updateData.phone = leadUpdate.phone;
        if (leadUpdate.email) updateData.email = leadUpdate.email;
        if (leadUpdate.serviceInterest)
          updateData.serviceInterest = leadUpdate.serviceInterest;
        if (leadUpdate.score) updateData.score = leadUpdate.score;
        if (leadUpdate.scoreNumeric != null)
          updateData.scoreNumeric = leadUpdate.scoreNumeric;
        if (leadUpdate.scoreReasoning)
          updateData.scoreReasoning = leadUpdate.scoreReasoning;

        if (leadUpdate.status === "nurture") {
          updateData.status = "nurture";
        } else if (leadUpdate.status === "qualified") {
          updateData.status = "qualified";
        } else if (leadUpdate.status === "appointment_requested") {
          updateData.status = "appointment_requested";
        } else if (
          leadUpdate.score &&
          (leadUpdate.name || leadUpdate.email || leadUpdate.phone)
        ) {
          updateData.status =
            leadUpdate.score === "COLD" ? "nurture" : "qualified";
        }

        const hadContact = !!(lead!.name || lead!.email || lead!.phone);
        const hasContact = !!(
          updateData.name ||
          updateData.email ||
          updateData.phone ||
          lead!.name ||
          lead!.email ||
          lead!.phone
        );

        await prisma.lead.update({
          where: { id: lead!.id },
          data: updateData,
        });

        if (!hadContact && hasContact) {
          await logActivity(
            workspace.id,
            "lead_created",
            `New lead — ${updateData.name ?? lead!.name ?? "Visitor"}`,
            { leadId: lead!.id }
          );
        }

        if (leadUpdate.score && leadUpdate.score !== lead!.score) {
          await logActivity(
            workspace.id,
            "score_changed",
            `${leadUpdate.score} lead — ${updateData.serviceInterest ?? lead!.serviceInterest ?? "Inquiry"}`,
            { leadId: lead!.id, score: leadUpdate.score }
          );
        }

        if (
          leadUpdate.status === "appointment_requested" ||
          leadUpdate.preferredTime
        ) {
          const existingAppointment = await prisma.appointment.findUnique({
            where: { leadId: lead!.id },
          });

          if (!existingAppointment) {
            await prisma.appointment.create({
              data: {
                workspaceId: workspace.id,
                leadId: lead!.id,
                preferredAtText: leadUpdate.preferredTime ?? null,
                status: "requested",
              },
            });

            await logActivity(
              workspace.id,
              "appointment_requested",
              `Appointment requested — ${updateData.name ?? lead!.name ?? "Lead"}`,
              { leadId: lead!.id }
            );
          }
        }
      }

      await prisma.visitorSession.update({
        where: { id: visitorSession!.id },
        data: { updatedAt: new Date() },
      });
    },
  });

  return result.toTextStreamResponse({
    headers: {
      "X-Session-Id": visitorSession.id,
      "X-Lead-Id": lead.id,
    },
  });
}
