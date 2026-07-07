"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `focus-ring rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      pathname === href
        ? "text-white"
        : "text-white/60 hover:text-white/90"
    }`;

  return (
    <header className="border-b border-white/10 bg-navy-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="focus-ring rounded-md">
          <Logo variant="light" size="sm" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/register" className={linkClass("/register")}>
            Hospital Registration
          </Link>
          <Link href="/login" className={linkClass("/login")}>
            Hospital Login
          </Link>
          <span className="ml-3 hidden items-center gap-1.5 rounded-full border border-seal-400/40 bg-seal-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-seal-200 sm:flex">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 2 20 6v6c0 5-3.6 8.6-8 10-4.4-1.4-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Official Portal
          </span>
        </nav>
      </div>
    </header>
  );
}
