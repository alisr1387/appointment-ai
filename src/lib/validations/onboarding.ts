import { z } from "zod";

export const businessInfoSchema = z.object({
  name: z.string().min(2, "Business name is required"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .optional(),
});

export const categorySchema = z.object({
  category: z.enum(["skin_beauty_clinic"]),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
});

export const servicesSchema = z.object({
  services: z.array(serviceSchema).min(1, "Add at least one service"),
});

export const goalSchema = z.object({
  conversionGoal: z.enum([
    "book_appointment",
    "get_leads",
    "receive_orders",
    "book_calls",
  ]),
});

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const knowledgeSchema = z.object({
  faq: z.array(faqItemSchema).default([]),
  policies: z.string().optional(),
  workingHours: z.string().optional(),
  knowledgeNotes: z.string().optional(),
});

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;
export type ServicesInput = z.infer<typeof servicesSchema>;
export type KnowledgeInput = z.infer<typeof knowledgeSchema>;
