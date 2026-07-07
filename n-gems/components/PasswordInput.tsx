"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import Input from "./Input";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label = "Password", error, hint, required, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        label={label}
        error={error}
        hint={hint}
        required={required}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 11V7.5a4 4 0 018 0V11" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        }
        rightSlot={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            className="focus-ring rounded p-0.5 text-navy-300 transition-colors hover:text-clinical-500"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3l18 18M10.6 10.7a3 3 0 004.2 4.2M6.7 6.6C4.5 8.1 3 10.3 2 12c1.6 2.8 5 7 10 7 1.8 0 3.4-.5 4.8-1.3M9.9 5.2A10.4 10.4 0 0112 5c5 0 8.4 4.2 10 7-.6 1-1.3 2-2.2 3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12c1.6-2.8 5-7 10-7s8.4 4.2 10 7c-1.6 2.8-5 7-10 7s-8.4-4.2-10-7Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
