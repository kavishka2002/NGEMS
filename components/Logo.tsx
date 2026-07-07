type LogoProps = {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
};

const sizeMap = {
  sm: { mark: 28, title: "text-sm", sub: "text-[9px]" },
  md: { mark: 38, title: "text-lg", sub: "text-[10px]" },
  lg: { mark: 56, title: "text-2xl", sub: "text-xs" },
};

export default function Logo({
  variant = "dark",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const dims = sizeMap[size];
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-3">
      <svg
        width={dims.mark}
        height={dims.mark}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M24 2 L44 10 V22 C44 34 36 42.5 24 46 C12 42.5 4 34 4 22 V10 L24 2Z"
          fill={isLight ? "#FFFFFF" : "#0B2545"}
          fillOpacity={isLight ? 0.12 : 1}
        />
        <path
          d="M24 5.2 L41 11.9 V22 C41 32.6 34 40.1 24 43.2 C14 40.1 7 32.6 7 22 V11.9 L24 5.2Z"
          stroke={isLight ? "#FFFFFF" : "#146C94"}
          strokeOpacity={isLight ? 0.55 : 1}
          strokeWidth="1.4"
        />
        <path
          d="M24 14V32M15 23H33"
          stroke={isLight ? "#FFFFFF" : "#1B998B"}
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <div className="leading-tight">
          <p
            className={`font-display font-semibold tracking-tight ${dims.title} ${
              isLight ? "text-white" : "text-navy-900"
            }`}
          >
            N-GEMS
          </p>
          <p
            className={`${dims.sub} font-medium uppercase tracking-[0.16em] ${
              isLight ? "text-white/60" : "text-navy-300"
            }`}
          >
            Govt. Medical Registry
          </p>
        </div>
      )}
    </div>
  );
}
