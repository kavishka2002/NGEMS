import Link from "next/link";
import Navbar from "@/components/Navbar";
import InfoPanel from "@/components/InfoPanel";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <InfoPanel />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-slate-50 px-6 py-16 text-center">
          <span className="rounded-full border border-health-400/40 bg-health-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-health-600">
            Frontend Preview
          </span>
          <h1 className="font-display max-w-lg text-3xl font-semibold text-navy-900 sm:text-4xl">
            National Government Electronic Medical System
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-navy-300">
            Choose an entry point below to preview the hospital onboarding flow.
          </p>
          <div className="flex w-full max-w-xs flex-col gap-3">
            <Link href="/register">
              <Button variant="primary">Hospital Registration</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Hospital Login</Button>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
