"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
  rightSlot?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, required, rightSlot, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="field-label">
            {label}
            {required && <span className="ml-0.5 text-clinical-500">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={`focus-ring w-full rounded-lg border bg-white py-2.5 text-sm text-navy-900 placeholder:text-navy-300/70 transition-colors duration-150 ${
              icon ? "pl-10" : "pl-3.5"
            } ${rightSlot ? "pr-10" : "pr-3.5"} ${
              error
                ? "border-rose-300 focus-visible:ring-rose-300"
                : "border-slate-200 hover:border-slate-300"
            } ${className}`}
            {...props}
          />
          {rightSlot && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightSlot}
            </span>
          )}
        </div>
        {error ? (
          <p className="field-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {error}
          </p>
        ) : hint ? (
          <p className="field-hint">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
