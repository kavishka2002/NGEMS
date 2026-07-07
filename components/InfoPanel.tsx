import Logo from "./Logo";

export default function InfoPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-navy-900 lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
      {/* watermark dot grid */}
      <div
        className="absolute inset-0 bg-cross-grid opacity-[0.5] [background-size:18px_18px]"
        aria-hidden="true"
      />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clinical-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-health-500/20 blur-3xl" />

      <div className="relative z-10 px-10 pt-10">
        <Logo variant="light" size="md" />
      </div>

      <div className="relative z-10 px-10">
        <svg
          viewBox="0 0 420 320"
          className="w-full max-w-md"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ground */}
          <ellipse cx="210" cy="288" rx="150" ry="14" fill="#071A33" opacity="0.5" />

          {/* connecting network lines */}
          <path d="M60 150 L150 210 M360 140 L270 205 M210 60 L210 205" stroke="#2C8FB5" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="60" cy="150" r="5" fill="#3CB6A8" />
          <circle cx="360" cy="140" r="5" fill="#3CB6A8" />
          <circle cx="210" cy="60" r="5" fill="#C4A15F" />

          {/* main hospital building */}
          <rect x="120" y="120" width="180" height="105" rx="6" fill="#0F5A7C" />
          <rect x="120" y="120" width="180" height="18" rx="6" fill="#146C94" />
          <rect x="150" y="150" width="24" height="24" rx="3" fill="#EAF5F9" opacity="0.9" />
          <rect x="198" y="150" width="24" height="24" rx="3" fill="#EAF5F9" opacity="0.9" />
          <rect x="246" y="150" width="24" height="24" rx="3" fill="#EAF5F9" opacity="0.9" />
          <rect x="150" y="186" width="24" height="24" rx="3" fill="#EAF5F9" opacity="0.7" />
          <rect x="246" y="186" width="24" height="24" rx="3" fill="#EAF5F9" opacity="0.7" />
          <rect x="196" y="182" width="28" height="43" rx="3" fill="#1B998B" />
          <path d="M204 200h12M210 194v12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />

          {/* side wings */}
          <rect x="70" y="165" width="50" height="60" rx="5" fill="#193A5C" />
          <rect x="300" y="165" width="50" height="60" rx="5" fill="#193A5C" />
          <rect x="84" y="180" width="16" height="16" rx="2" fill="#CDE9F1" opacity="0.6" />
          <rect x="314" y="180" width="16" height="16" rx="2" fill="#CDE9F1" opacity="0.6" />

          {/* roof cross emblem */}
          <rect x="198" y="96" width="24" height="24" rx="4" fill="#0B2545" stroke="#C4A15F" strokeWidth="1.5" />
          <path d="M210 102v12M204 108h12" stroke="#C4A15F" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 px-10 pb-10">
        <p className="font-display text-xl font-semibold leading-snug text-white sm:text-2xl">
          National Government Electronic Medical System
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
          Connecting hospitals with secure digital healthcare management —
          one national registry for every government hospital.
        </p>

        <div className="mt-8 flex gap-8 border-t border-white/10 pt-6">
          <div>
            <p className="font-display text-2xl font-semibold text-white">312</p>
            <p className="text-xs text-white/50">Registered hospitals</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-white">9</p>
            <p className="text-xs text-white/50">Provinces covered</p>
          </div>
          <div>
            <p className="font-display text-2xl font-semibold text-white">24/7</p>
            <p className="text-xs text-white/50">Registry support</p>
          </div>
        </div>
      </div>
    </div>
  );
}
