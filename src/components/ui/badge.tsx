import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "teal";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "border-transparent bg-slate-900 text-slate-50 shadow-xs dark:bg-slate-50 dark:text-slate-900",
    secondary: "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
    destructive: "border-transparent bg-rose-500 text-white shadow-xs dark:bg-rose-900",
    outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-800",
    success: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    warning: "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    teal: "border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
  }[variant];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
