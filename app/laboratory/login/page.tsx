"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";

export default function LaboratoryLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ hospitalId: "", username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({ ...current, [key]: e.target.value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/laboratory/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to sign in.");
      }

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "ngemsLaboratorySession",
          JSON.stringify({
            authenticated: true,
            hospitalId: data.hospitalId,
            hospitalName: data.hospitalName,
            role: data.role,
          })
        );
        document.cookie = `ngemsLaboratorySession=${encodeURIComponent(JSON.stringify({ authenticated: true, hospitalId: data.hospitalId, hospitalName: data.hospitalName, role: data.role }))}; path=/; max-age=3600`;
      }

      router.push(data.redirectPath || "/laboratory/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-seal-50">
            <FlaskConical className="h-6 w-6 text-seal-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-seal-600">Laboratory Access</p>
            <h1 className="text-xl font-semibold text-navy">Laboratory Login</h1>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Hospital ID" value={form.hospitalId} onChange={update("hospitalId")} placeholder="Enter hospital ID" />
          <Input label="Username" value={form.username} onChange={update("username")} placeholder="Enter laboratory username" />
          <PasswordInput value={form.password} onChange={update("password")} placeholder="Enter password" />
          <Button type="submit" loading={submitting} className="w-full">Sign in</Button>
        </form>

        <div className="mt-6 text-center text-sm text-navy/60">
          <Link href="/" className="font-medium text-seal-600 hover:underline">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
