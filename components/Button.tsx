"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "focus-ring relative inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<string, string> = {
    primary:
      "bg-navy-900 text-white shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] hover:bg-navy-800",
    secondary:
      "border border-clinical-500 text-clinical-600 bg-white hover:bg-clinical-50",
    ghost: "text-navy-600 hover:bg-slate-100",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v3.2a4.8 4.8 0 00-4.8 4.8H4z"
          />
        </svg>
      )}
      {loading ? "Processing…" : children}
    </button>
  );
}
