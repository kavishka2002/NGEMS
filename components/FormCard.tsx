import { ReactNode } from "react";

type FormCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
};

export default function FormCard({
  eyebrow,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-xl",
}: FormCardProps) {
  return (
    <div
      className={`w-full ${maxWidth} animate-fade-in rounded-2xl border border-slate-150 bg-white p-8 shadow-card sm:p-10`}
    >
      <div className="mb-7">
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-health-600">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-[28px]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-navy-300">{description}</p>
        )}
      </div>
      {children}
      {footer && <div className="mt-7">{footer}</div>}
    </div>
  );
}
