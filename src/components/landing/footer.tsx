import { Zap } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/20 ring-1 ring-accent/30">
              <Zap className="h-3.5 w-3.5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-white">
              AI Conversion Engine
            </span>
          </div>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AI Conversion Engine
          </p>
        </div>
      </div>
    </footer>
  );
}
