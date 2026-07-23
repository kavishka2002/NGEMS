"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Button from "@/components/Button";
import { FlaskConical } from "lucide-react";

export default function LaboratoryPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("ngemsLaboratorySession");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.authenticated) {
          router.replace("/laboratory/dashboard");
        }
      } catch {
        router.replace("/laboratory/login");
      }
    }
  }, [router]);

  const handleLaboratoryAccess = (e: FormEvent) => {
    e.preventDefault();
    router.push("/laboratory/login");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#F0F4F8" }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-14 w-14 rounded-lg bg-seal-600 flex items-center justify-center">
                <FlaskConical size={28} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-seal-600">
                  Laboratory Module
                </p>
                <h1 className="font-display text-3xl font-bold text-navy-900">
                  Laboratory Testing System
                </h1>
              </div>
            </div>
            <p className="text-lg text-navy/60 max-w-2xl mx-auto">
              Manage lab requests, sample collection, test processing, and generate comprehensive laboratory reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Features Cards */}
            {[
              {
                icon: "📋",
                title: "Lab Requests",
                description: "Manage incoming laboratory test requests",
              },
              {
                icon: "🧬",
                title: "Sample Collection",
                description: "Record and track sample collection",
              },
              {
                icon: "🧪",
                title: "Test Processing",
                description: "Process tests and upload results",
              },
              {
                icon: "📊",
                title: "Reports & Analytics",
                description: "Generate and share lab reports",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-border bg-white p-6 shadow-card hover:shadow-cardHover transition"
              >
                <p className="text-3xl mb-3">{feature.icon}</p>
                <h3 className="font-bold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-navy/60">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="primary"
              className="px-8 py-3 text-lg flex items-center justify-center gap-2"
              onClick={handleLaboratoryAccess}
            >
              <FlaskConical size={20} />
              Access Laboratory
            </Button>
            <Link href="/dashboard">
              <Button type="button" variant="secondary" className="px-8 py-3 text-lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
