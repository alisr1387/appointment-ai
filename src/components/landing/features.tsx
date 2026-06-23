import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "AI Customer Qualification",
    description:
      "Intelligent conversations that understand visitor intent and filter serious buyers from casual browsers.",
  },
  {
    icon: Target,
    title: "Lead Scoring",
    description:
      "Every lead is scored HOT, WARM, or COLD so your team focuses on what matters most.",
    badge: (
      <div className="mt-3 flex gap-2">
        <Badge variant="hot">HOT</Badge>
        <Badge variant="warm">WARM</Badge>
        <Badge variant="cold">COLD</Badge>
      </div>
    ),
  },
  {
    icon: Calendar,
    title: "Automatic Appointment Booking",
    description:
      "Qualified visitors book directly into your calendar — no back-and-forth, no missed slots.",
  },
  {
    icon: LayoutDashboard,
    title: "Business Dashboard",
    description:
      "A unified command center for conversations, leads, appointments, and team performance.",
  },
  {
    icon: BarChart3,
    title: "Conversion Analytics",
    description:
      "Track conversion rates, lead quality, and ROI with real-time analytics built for growth.",
  },
];

export function Features() {
  return (
    <section id="features" className="section-anchor py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything you need to convert
          </h2>
          <p className="mt-4 text-slate-400">
            A complete AI conversion stack — from first touch to booked
            appointment.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-glow"
            >
              <CardContent className="p-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                  <feature.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {feature.description}
                </p>
                {feature.badge}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
