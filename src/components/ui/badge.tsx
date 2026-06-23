import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/5 text-white",
        hot: "border-red-500/30 bg-red-500/10 text-red-400",
        warm: "border-amber-500/30 bg-amber-500/10 text-amber-400",
        cold: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        accent: "border-accent/30 bg-accent/10 text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
