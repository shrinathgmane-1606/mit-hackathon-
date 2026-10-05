import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "teal";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-98 cursor-pointer";

    const variantStyles = {
      default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 shadow-xs",
      destructive: "bg-rose-600 text-white hover:bg-rose-700 shadow-xs",
      outline: "border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
      ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
      link: "text-teal-600 underline-offset-4 hover:underline",
      teal: "bg-teal-600 text-white hover:bg-teal-700 shadow-xs",
    }[variant];

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-base",
      icon: "h-9 w-9",
    }[size];

    return (
      <button
        className={cn(baseStyles, variantStyles, sizeStyles, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
