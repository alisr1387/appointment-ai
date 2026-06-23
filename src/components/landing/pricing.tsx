import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$149",
    period: "/month",
    description: "For single-location clinics getting started with AI.",
    features: [
      "AI qualification chatbot",
      "Up to 200 conversations/mo",
      "Lead scoring (HOT/WARM/COLD)",
      "Email notifications",
      "Basic analytics",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$349",
    period: "/month",
    description: "For growing clinics ready to scale conversions.",
    features: [
      "Everything in Starter",
      "Unlimited conversations",
      "Automatic appointment booking",
      "Full business dashboard",
      "Conversion analytics",
      "CRM integrations",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most popular",
  },
  {
    name: "Business",
    price: "$699",
    period: "/month",
    description: "For multi-location clinics and enterprise teams.",
    features: [
      "Everything in Growth",
      "Multi-location support",
      "Custom AI training",
      "Dedicated account manager",
      "API access",
      "SLA guarantee",
      "White-label options",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="section-anchor py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-slate-400">
            Choose the plan that fits your clinic. Scale as you grow.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "relative transition-all duration-300",
                plan.highlighted
                  ? "scale-[1.02] border-accent/40 bg-white/[0.05] glow-indigo-lg lg:scale-105"
                  : "hover:border-white/20 hover:shadow-glow"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{plan.description}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                <Button
                  className={cn(
                    "mt-6 w-full",
                    plan.highlighted && "glow-indigo"
                  )}
                  variant={plan.highlighted ? "default" : "secondary"}
                >
                  Get Started
                </Button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
