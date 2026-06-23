import { ArrowRight, Brain, CalendarCheck, MousePointerClick } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MousePointerClick,
    title: "Visitor enters your page",
    description:
      "A potential client lands on your clinic website, curious about treatments.",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI understands and qualifies them",
    description:
      "Our AI engages, scores intent, and identifies high-value leads in real time.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Business receives a customer or appointment",
    description:
      "Qualified leads are routed to your team — or booked directly into your calendar.",
  },
];

export function Solution() {
  return (
    <section id="how-it-works" className="section-anchor py-24 md:py-32">
      <div className="section-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            One AI system that turns attention into revenue
          </h2>
          <p className="mt-4 text-slate-400">
            From first click to booked appointment — fully automated.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent/30 to-transparent md:block" />

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-10 hidden h-5 w-5 text-accent/40 md:block" />
                )}

                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md">
                  <div className="absolute -top-3 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-white">
                    {step.number}
                  </div>
                  <step.icon className="h-8 w-8 text-accent" />
                </div>

                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
