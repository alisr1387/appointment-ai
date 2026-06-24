"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Zap,
} from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageSquare },
  { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({
  businessName,
}: {
  businessName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-white/5 bg-white/[0.01] md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/30">
          <Zap className="h-4 w-4 text-accent" />
        </div>
        <span className="truncate text-sm font-semibold text-white">
          {businessName}
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent/15 text-white"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/5 p-3">
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-white/5 p-2 md:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs",
              active ? "bg-accent/15 text-white" : "text-slate-500"
            )}
          >
            <item.icon className="h-3.5 w-3.5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
