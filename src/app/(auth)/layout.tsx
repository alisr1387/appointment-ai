import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="absolute inset-0 -z-10 hero-glow" />
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 ring-1 ring-accent/30">
          <Zap className="h-5 w-5 text-accent" />
        </div>
        <span className="text-lg font-semibold text-white">AI Conversion Engine</span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e14]/90 p-8 shadow-glow-lg backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
