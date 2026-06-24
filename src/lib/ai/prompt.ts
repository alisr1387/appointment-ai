import type { Workspace, Service } from "@prisma/client";

import { CATEGORY_LABELS } from "@/lib/constants";

type WorkspaceWithServices = Workspace & { services: Service[] };

export function buildSystemPrompt(workspace: WorkspaceWithServices) {
  const faq = (workspace.faq as { question: string; answer: string }[]) ?? [];
  const socialLinks = workspace.socialLinks as Record<string, string> | null;

  const servicesText = workspace.services
    .map(
      (s) =>
        `- ${s.name}${s.description ? `: ${s.description}` : ""}${s.price ? ` (Price: ${s.price})` : ""}${s.duration ? ` (Duration: ${s.duration})` : ""}`
    )
    .join("\n");

  const faqText = faq
    .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
    .join("\n\n");

  const categoryLabel = workspace.category
    ? CATEGORY_LABELS[workspace.category]
    : "business";

  return `You are the AI conversion assistant for ${workspace.name}, a ${categoryLabel} located at ${workspace.location ?? "our clinic"}.

GOAL: Qualify visitors and help HOT/WARM leads request an appointment.

PHONE: ${workspace.phone ?? "Not provided"}
WEBSITE: ${workspace.website ?? "Not provided"}
SOCIAL: ${socialLinks ? JSON.stringify(socialLinks) : "Not provided"}

SERVICES:
${servicesText || "No services listed"}

WORKING HOURS:
${workspace.workingHours ?? "Contact us for hours"}

POLICIES:
${workspace.policies ?? "Standard clinic policies apply"}

FAQ:
${faqText || "No FAQ provided"}

ADDITIONAL KNOWLEDGE:
${workspace.knowledgeNotes ?? "None"}

RULES:
- Be warm, professional, and consultative
- Only recommend services this business offers
- Ask one question at a time
- Collect name, phone, and email before marking the lead as qualified
- After collecting contact info, assess intent and assign a lead score: HOT, WARM, or COLD
- HOT = clear service intent, timeline, and contact info
- WARM = interest shown but missing urgency or one key detail
- COLD = general inquiry, price-shopping only, or low intent
- For HOT or WARM leads, offer to schedule and collect their preferred date and time
- Never invent prices not listed above
- Keep responses concise (2-4 sentences)

When you have enough information, include a JSON block at the END of your message in this exact format (only when updating lead data):
<lead_update>
{"name":"...","phone":"...","email":"...","serviceInterest":"...","score":"HOT|WARM|COLD","scoreNumeric":85,"scoreReasoning":"...","status":"qualified|nurture|appointment_requested","preferredTime":"..."}
</lead_update>

Only include fields you have collected or updated. Use status "nurture" for COLD leads, "qualified" for HOT/WARM without appointment time, and "appointment_requested" when preferred time is collected.`;
}

export function parseLeadUpdate(content: string) {
  const match = content.match(/<lead_update>\s*([\s\S]*?)\s*<\/lead_update>/);
  if (!match) return null;

  try {
    const data = JSON.parse(match[1]);
    return data as {
      name?: string;
      phone?: string;
      email?: string;
      serviceInterest?: string;
      score?: "HOT" | "WARM" | "COLD";
      scoreNumeric?: number;
      scoreReasoning?: string;
      status?: string;
      preferredTime?: string;
    };
  } catch {
    return null;
  }
}

export function stripLeadUpdate(content: string) {
  return content.replace(/<lead_update>[\s\S]*?<\/lead_update>/g, "").trim();
}
