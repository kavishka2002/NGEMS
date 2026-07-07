"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import InfoPanel from "@/components/InfoPanel";
import FormCard from "@/components/FormCard";
import Input from "@/components/Input";
import Select from "@/components/Select";
import PasswordInput from "@/components/PasswordInput";
import FileUpload from "@/components/FileUpload";
import HospitalIdField from "@/components/HospitalIdField";
import Button from "@/components/Button";
import SuccessModal from "@/components/SuccessModal";

const HOSPITAL_TYPES = [
  "National Hospital",
  "Teaching Hospital",
  "District Hospital",
  "Base Hospital",
  "Rural Hospital",
];

const PROVINCES = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Jaffna",
  "Kurunegala",
  "Anuradhapura",
  "Badulla",
  "Ratnapura",
];

type FormState = {
  hospitalName: string;
  hospitalType: string;
  province: string;
  district: string;
  address: string;
  contactNumber: string;
  email: string;
  adminName: string;
  adminUsername: string;
  password: string;
  confirmPassword: string;
};

const initialState: FormState = {
  hospitalName: "",
  hospitalType: "",
  province: "",
  district: "",
  address: "",
  contactNumber: "",
  email: "",
  adminName: "",
  adminUsername: "",
  password: "",
  confirmPassword: "",
};

function generateHospitalId() {
  const year = new Date().getFullYear();
  const serial = Math.floor(100000 + Math.random() * 899999);
  return `NGEMS-HOS-${year}-${serial}`;
}

export default function RegisterPage() {
  const hospitalId = useMemo(() => generateHospitalId(), []);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const update = (key: keyof FormState) => (e: any) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.hospitalName.trim()) next.hospitalName = "Hospital name is required.";
    if (!form.hospitalType) next.hospitalType = "Select a hospital type.";
    if (!form.province) next.province = "Select a province.";
    if (!form.district) next.district = "Select a district.";
    if (!form.address.trim()) next.address = "Hospital address is required.";

    if (!form.contactNumber.trim()) {
      next.contactNumber = "Contact number is required.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.contactNumber)) {
      next.contactNumber = "Enter a valid contact number.";
    }

    if (!form.email.trim()) {
      next.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }

    if (!form.adminName.trim()) next.adminName = "Administrator name is required.";

    if (!form.adminUsername.trim()) {
      next.adminUsername = "Choose a username.";
    } else if (form.adminUsername.length < 4) {
      next.adminUsername = "Username must be at least 4 characters.";
    }

    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Use at least 8 characters.";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // UI-only demo: simulate a submission delay before showing confirmation.
    setTimeout(() => {
      setSubmitting(false);
      setShowSuccess(true);
    }, 900);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <InfoPanel />

        <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-10 sm:px-8">
          <FormCard
            eyebrow="Step 1 of 1 · Facility Onboarding"
            title="Register Your Hospital"
            description="Provide your facility's details to request an official N-GEMS registry ID. Fields marked with * are required."
            maxWidth="max-w-2xl"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-7">
              <section className="space-y-5">
                <p className="divider-label">Hospital Information</p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Hospital Name"
                      name="hospitalName"
                      placeholder="e.g. Colombo General Hospital"
                      required
                      value={form.hospitalName}
                      onChange={update("hospitalName")}
                      error={errors.hospitalName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <HospitalIdField value={hospitalId} />
                  </div>

                  <Select
                    label="Hospital Type"
                    name="hospitalType"
                    options={HOSPITAL_TYPES}
                    required
                    value={form.hospitalType}
                    onChange={update("hospitalType")}
                    error={errors.hospitalType}
                  />

                  <div className="grid grid-cols-2 gap-5">
                    <Select
                      label="Province"
                      name="province"
                      options={PROVINCES}
                      required
                      value={form.province}
                      onChange={update("province")}
                      error={errors.province}
                    />
                    <Select
                      label="District"
                      name="district"
                      options={DISTRICTS}
                      required
                      value={form.district}
                      onChange={update("district")}
                      error={errors.district}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Hospital Address"
                      name="address"
                      placeholder="Street, city, postal code"
                      required
                      value={form.address}
                      onChange={update("address")}
                      error={errors.address}
                    />
                  </div>

                  <Input
                    label="Contact Number"
                    name="contactNumber"
                    type="tel"
                    placeholder="+94 11 234 5678"
                    required
                    value={form.contactNumber}
                    onChange={update("contactNumber")}
                    error={errors.contactNumber}
                    icon={
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 6.2 2 2 0 016.5 4Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="registry@hospital.gov"
                    required
                    value={form.email}
                    onChange={update("email")}
                    error={errors.email}
                    icon={
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.7" />
                        <path d="M4.5 7 12 12.5 19.5 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                  />
                </div>
              </section>

              <section className="space-y-5">
                <p className="divider-label">Hospital Administrator</p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      label="Admin Full Name"
                      name="adminName"
                      placeholder="Dr. / Mr. / Ms. Full Name"
                      required
                      value={form.adminName}
                      onChange={update("adminName")}
                      error={errors.adminName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="Admin Username"
                      name="adminUsername"
                      placeholder="Choose a unique username"
                      required
                      value={form.adminUsername}
                      onChange={update("adminUsername")}
                      error={errors.adminUsername}
                    />
                  </div>

                  <PasswordInput
                    label="Password"
                    name="password"
                    placeholder="At least 8 characters"
                    required
                    value={form.password}
                    onChange={update("password")}
                    error={errors.password}
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    required
                    value={form.confirmPassword}
                    onChange={update("confirmPassword")}
                    error={errors.confirmPassword}
                  />
                </div>
              </section>

              <section className="space-y-5">
                <p className="divider-label">Upload</p>
                <FileUpload />
              </section>

              <div className="pt-1">
                <Button type="submit" loading={submitting}>
                  Register Hospital
                </Button>
                <p className="mt-4 text-center text-sm text-navy-300">
                  Already registered?{" "}
                  <Link href="/login" className="font-medium text-clinical-600 hover:underline">
                    Sign in to your hospital account
                  </Link>
                </p>
              </div>
            </form>
          </FormCard>
        </main>
      </div>

      <SuccessModal
        open={showSuccess}
        hospitalId={hospitalId}
        hospitalName={form.hospitalName || "Your hospital"}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
