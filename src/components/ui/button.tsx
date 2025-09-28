import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** optional variants */
  variant?: "default" | "outline" | "destructive";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-4 py-2";
    const variants: Record<typeof variant, string> = {
      default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600",
      outline:
        "border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 focus:ring-gray-400",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
