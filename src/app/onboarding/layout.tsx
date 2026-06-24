import Link from "next/link";
import { Zap } from "lucide-react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="section-container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/30">
              <Zap className="h-4 w-4 text-accent" />
            </div>
            <span className="text-sm font-semibold text-white">
              AI Conversion Engine
            </span>
          </Link>
        </div>
      </header>
      <main className="section-container max-w-2xl py-12">{children}</main>
    </div>
  );
}
