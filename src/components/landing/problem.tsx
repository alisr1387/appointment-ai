import { Clock, Target, TrendingDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const problems = [
  {
    icon: Clock,
    title: "Slow responses",
    description:
      "Visitors leave before you can respond. Every minute of delay costs you a potential customer.",
  },
  {
    icon: Target,
    title: "Unqualified leads",
    description:
      "Your team spends hours on leads that were never going to convert. Time wasted, revenue lost.",
  },
  {
    icon: TrendingDown,
    title: "Missed opportunities",
    description:
      "High-intent visitors slip through without booking. You're paying for traffic that never converts.",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Businesses lose customers every day
          </h2>
          <p className="mt-4 text-slate-400">
            Without intelligent qualification, premium clinics leave revenue on
            the table.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((item) => (
            <Card
              key={item.title}
              className="group transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-glow"
            >
              <CardContent className="p-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all group-hover:bg-accent/10 group-hover:ring-accent/20">
                  <item.icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
