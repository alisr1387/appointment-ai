"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { HeroDashboard } from "@/components/landing/hero-dashboard";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="absolute inset-0 hero-glow" />
      <div className="absolute inset-0 mesh-bg opacity-40" />

      <div className="section-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-6 text-sm font-medium text-accent">
            Built for premium skin &amp; beauty clinics
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Convert More Visitors Into Paying Customers With AI
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            AI-powered customer qualification and booking systems for modern
            businesses.
          </p>

          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Turn your visitors into qualified customers automatically.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="glow-indigo w-full sm:w-auto">
              Create Your AI Conversion System
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-16 md:mt-20">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
