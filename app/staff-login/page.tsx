"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";

type FormState = {
  hospitalId: string;
  username: string;
  password: string;
};

type DemoAccountResult = {
  valid: boolean;
  role?: string;
};

function validateDemoAccount(
  hospitalId: string,
  username: string,
  password: string
): DemoAccountResult {
  const normalizedHospitalId = hospitalId.trim().toUpperCase();
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!normalizedHospitalId.startsWith("NGEMS-HOS")) {
    return { valid: false };
  }

  const demoAccounts: Record<string, { password: string; role: string }> = {
    admin: { password: "admin123", role: "Admin" },
    doctor: { password: "doctor123", role: "Doctor" },
    reception: { password: "reception123", role: "Reception Staff" },
    pharmacy: { password: "pharmacy123", role: "Pharmacy Staff" },
    laboratory: { password: "laboratory123", role: "Laboratory Staff" },
  };

  const account = demoAccounts[normalizedUsername];

  if (!account || account.password !== normalizedPassword) {
    return { valid: false };
  }

  return {
    valid: true,
    role: account.role,
  };
}

export default function StaffLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    hospitalId: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [key]: event.target.value,
      }));

      setErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
    };

  const validate = () => {
    const next: Partial<FormState> = {};

    if (!form.hospitalId.trim()) {
      next.hospitalId = "Hospital ID is required.";
    }

    if (!form.username.trim()) {
      next.username = "Username is required.";
    }

    if (!form.password) {
      next.password = "Password is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const saveSession = (session: Record<string, unknown>) => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "ngemsHospitalSession",
      JSON.stringify(session)
    );
  };

  const redirectByRole = (roleValue: unknown) => {
    const role = String(roleValue ?? "").toLowerCase();

    if (role.includes("doctor")) {
      router.push("/doctor/dashboard");
    } else if (role.includes("reception")) {
      router.push("/dashboard/reception");
    } else if (role.includes("pharmacy")) {
      router.push("/pharmacy");
    } else if (role.includes("laboratory")) {
      router.push("/laboratory");
    } else {
      router.push("/dashboard");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const normalizedHospitalId = form.hospitalId.trim();
      const normalizedUsername = form.username.trim();

      const demoCheck = validateDemoAccount(
        normalizedHospitalId,
        normalizedUsername,
        form.password
      );

      if (demoCheck.valid) {
        const role = demoCheck.role ?? "Staff";

        saveSession({
          hospitalId: normalizedHospitalId,
          hospitalName: "NGEMS Hospital",
          username: normalizedUsername,
          role,
        });

        redirectByRole(role);
        return;
      }

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalId: normalizedHospitalId,
          username: normalizedUsername,
          password: form.password,
        }),
      });

      let data: Record<string, unknown>;

      try {
        data = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }

      if (!response.ok) {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Invalid credentials."
        );
      }

<<<<<<< HEAD
      saveSession({
        hospitalId: data.hospitalId ?? normalizedHospitalId,
        hospitalName: data.hospitalName ?? "NGEMS Hospital",
        hospitalType: data.hospitalType,
        province: data.province,
        district: data.district,
        address: data.address,
        contactNumber: data.contactNumber,
        email: data.email,
        username: data.username ?? normalizedUsername,
        role: data.role ?? "Staff",
      });

      redirectByRole(data.role);
=======
      const redirectPath = data.redirectPath || "/dashboard";
      router.push(redirectPath);
>>>>>>> 520c4eed498894a0e26e5ad004fd07202195b9cb
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to sign in."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-clinical-100/60 blur-3xl" />

        <div className="relative z-10 w-full max-w-md animate-fade-in">
          <div className="mb-7 flex flex-col items-center text-center">
            <Logo size="lg" showWordmark={false} />
            <p className="mt-4 font-display text-2xl font-semibold text-navy-900">
              N-GEMS
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-navy-300">
              National Government Electronic Medical System
            </p>
          </div>

          <div className="rounded-2xl border border-slate-150 bg-white p-8 shadow-card sm:p-9">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-clinical-50">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 21V9.5L12 4l8 5.5V21"
                      stroke="#146C94"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.5 21v-6h5v6"
                      stroke="#146C94"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 9.2v3.6M10.2 11h3.6"
                      stroke="#1B998B"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="font-display text-xl font-semibold text-navy-900">
                    Staff Login
                  </h1>
                  <p className="text-xs text-navy-300">
                    Sign in with your staff credentials.
                  </p>
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {formError}
                </div>
              )}

              <Input
                label="Hospital ID"
                name="hospitalId"
                placeholder="NGEMS-HOS-2026-000000"
                required
                value={form.hospitalId}
                onChange={update("hospitalId")}
                error={errors.hospitalId}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2 20 6v6c0 5-3.6 8.6-8 10-4.4-1.4-8-5-8-10V6l8-4Z"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                  </svg>
                }
              />

              <Input
                label="Username"
                name="username"
                placeholder="Enter your staff username"
                required
                value={form.username}
                onChange={update("username")}
                error={errors.username}
                icon={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="8.2"
                      r="3.2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />
                    <path
                      d="M5 20c1-3.6 4-5.5 7-5.5s6 1.9 7 5.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />

              <PasswordInput
                name="password"
                placeholder="Enter your password"
                required
                value={form.password}
                onChange={update("password")}
                error={errors.password}
              />

              <div className="flex items-center justify-between pt-1 text-sm">
                <Link
                  href="/login"
                  className="font-medium text-clinical-600 hover:underline"
                >
                  Back to Hospital Login
                </Link>
              </div>

              <div className="pt-2">
                <Button type="submit" loading={submitting}>
                  Staff Login
                </Button>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-navy-300">
            Staff accounts are managed by your hospital administration.
          </p>
        </div>
      </main>
    </div>
  );
}