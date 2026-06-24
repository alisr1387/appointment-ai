import Link from "next/link";

import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 px-8 py-20 text-center md:px-16 md:py-24">
          <div className="absolute inset-0 hero-glow" />
          <div className="absolute inset-0 mesh-bg opacity-30" />

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Stop losing potential customers.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Join premium clinics using AI to qualify, score, and book
              customers automatically.
            </p>
            <Button size="lg" className="mt-10 glow-indigo-lg" asChild>
              <Link href="/signup">Build Your AI Conversion Engine</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
