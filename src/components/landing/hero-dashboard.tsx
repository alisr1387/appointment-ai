"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "AI Conversations", value: "1,284", change: "+12%" },
  { label: "Qualified Leads", value: "342", change: "+28%" },
  { label: "Appointments", value: "89", change: "+18%" },
  { label: "Conversion Rate", value: "26.7%", change: "+4.2%" },
];

const activities = [
  { text: "New HOT lead — Laser Treatment", time: "2m ago", hot: true },
  { text: "Appointment booked — Skin Consultation", time: "8m ago", hot: false },
  { text: "AI qualified lead — Botox inquiry", time: "14m ago", hot: true },
];

function MiniChart() {
  const points = [20, 35, 28, 45, 38, 55, 48, 62, 58, 72, 68, 80];
  const width = 280;
  const height = 80;
  const max = Math.max(...points);
  const coords = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - (p / max) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99,102,241,0.3)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0)" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${coords} ${width},${height}`}
        fill="url(#chartGrad)"
      />
      <polyline
        points={coords}
        fill="none"
        stroke="rgba(99,102,241,0.8)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mx-auto w-full max-w-5xl"
    >
      <div className="absolute inset-0 -z-10 mesh-bg opacity-60" />
      <div className="absolute inset-x-0 top-1/2 -z-10 h-64 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="animate-float overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e14]/90 shadow-glow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-white/10" />
            <div className="h-3 w-3 rounded-full bg-white/10" />
            <div className="h-3 w-3 rounded-full bg-white/10" />
          </div>
          <span className="ml-2 text-xs text-slate-500">
            app.aiconversionengine.com
          </span>
        </div>

        <div className="flex">
          <div className="hidden w-14 flex-col items-center gap-4 border-r border-white/5 py-5 sm:flex">
            {[LayoutDashboard, MessageSquare, Users, Calendar, TrendingUp, Settings].map(
              (Icon, i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    i === 0 ? "bg-accent/20 text-accent" : "text-slate-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )
            )}
          </div>

          <div className="flex-1 p-4 sm:p-6">
            <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/5 bg-white/[0.02] p-3"
                >
                  <p className="text-xs text-slate-500">{stat.label}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs text-emerald-400">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 lg:col-span-3">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Conversion Trend
                  </span>
                  <Activity className="h-3.5 w-3.5 text-accent" />
                </div>
                <div className="h-20">
                  <MiniChart />
                </div>
              </div>

              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 lg:col-span-2">
                <span className="text-xs font-medium text-slate-400">
                  Recent Activity
                </span>
                <div className="mt-3 space-y-2.5">
                  {activities.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            item.hot ? "bg-red-400" : "bg-emerald-400"
                          }`}
                        />
                        <span className="text-xs text-slate-300">{item.text}</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-slate-500">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
              <Badge variant="hot">HOT</Badge>
              <span className="text-xs text-slate-400">
                Ali — Laser Treatment — Appointment booked
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
