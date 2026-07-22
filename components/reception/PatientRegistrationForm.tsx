"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserPlus, HeartPulse, Building2, RotateCcw, ScanSearch, CheckCircle2 } from "lucide-react";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import { PROVINCES, DISTRICTS, BLOOD_GROUPS, DEPARTMENTS, calcAge } from "@/lib/reception-data";
import { getStaffList } from "@/lib/staff-service";

const GENDERS = ["Male", "Female", "Other"];
const APPOINTMENT_TYPES = ["OPD Visit", "Clinic Visit", "Emergency Visit"];
const PRIORITIES = ["Normal", "Emergency"];
const DISABILITY_OPTIONS = ["None", "Physical", "Visual", "Hearing", "Intellectual", "Other"];

type FormState = {
  nic: string;
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  mobile: string;
  emergencyContact: string;
  address: string;
  province: string;
  district: string;
  guardianName: string;
  guardianContact: string;
  allergies: string;
  diseases: string;
  medications: string;
  disability: string;
  notes: string;
  department: string;
  doctor: string;
  appointmentType: string;
  priority: string;
};

const initialState: FormState = {
  nic: "",
  fullName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  mobile: "",
  emergencyContact: "",
  address: "",
  province: "",
  district: "",
  guardianName: "",
  guardianContact: "",
  allergies: "",
  diseases: "",
  medications: "",
  disability: "",
  notes: "",
  department: "",
  doctor: "",
  appointmentType: "",
  priority: "Normal",
};

function nextPatientId() {
  const serial = 5820 + Math.floor(Math.random() * 40) + 1;
  return `PAT-${String(serial).padStart(5, "0")}`;
}

type PatientRegistrationFormProps = {
  onCheckExisting: (query: string) => void;
};

export default function PatientRegistrationForm({ onCheckExisting }: PatientRegistrationFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<string[]>([]);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorLoadError, setDoctorLoadError] = useState<string | null>(null);

  const update = (key: keyof FormState) => (e: any) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const age = form.dob ? calcAge(form.dob) : null;

  useEffect(() => {
    const loadDoctorOptions = async () => {
      const rawSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
      const hospitalId = rawSession ? (JSON.parse(rawSession) as { hospitalId?: string })?.hospitalId : null;

      if (!hospitalId) {
        setDoctorLoadError("Unable to load doctors without a valid hospital session.");
        setDoctorLoading(false);
        return;
      }

      try {
        const doctorsData = await getStaffList(hospitalId, "Doctor");
        setDoctors(doctorsData.map((doctor) => doctor.fullName).filter(Boolean));
      } catch (error) {
        console.error("Failed to load doctor list", error);
        setDoctorLoadError("Failed to load doctor list.");
      } finally {
        setDoctorLoading(false);
      }
    };

    void loadDoctorOptions();
  }, []);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.nic.trim()) next.nic = "NIC / Passport number is required.";
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    if (!form.gender) next.gender = "Select a gender.";

    if (!form.mobile.trim()) {
      next.mobile = "Mobile number is required.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(form.mobile)) {
      next.mobile = "Enter a valid mobile number.";
    }

    if (!form.emergencyContact.trim()) next.emergencyContact = "Emergency contact is required.";
    if (!form.address.trim()) next.address = "Address is required.";
    if (!form.province) next.province = "Select a province.";
    if (!form.district) next.district = "Select a district.";
    if (!form.department) next.department = "Select a department.";
    if (!form.appointmentType) next.appointmentType = "Select an appointment type.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessId(null);
    setServerError(null);

    if (!validate()) return;

    const rawSession = typeof window !== "undefined" ? window.localStorage.getItem("ngemsHospitalSession") : null;
    if (!rawSession) {
      setServerError("Hospital session is missing. Please log in again.");
      return;
    }

    const session = JSON.parse(rawSession) as { hospitalId?: string; hospitalName?: string };
    if (!session?.hospitalId || !session?.hospitalName) {
      setServerError("Hospital session is incomplete. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hospitalId: session.hospitalId,
          hospitalName: session.hospitalName,
          ...form,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        setServerError(result.error || "Patient registration failed.");
        return;
      }

      setSuccessId(result.patient?.patientId || result.patientId || "Registered");
      setForm(initialState);
    } catch (error) {
      console.error("Registration failed", error);
      setServerError("Failed to register patient. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm(initialState);
    setErrors({});
    setSuccessId(null);
  };

  return (
    <div id="registration" className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card sm:p-7 scroll-mt-24">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
            <UserPlus size={18} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-navy-900">
              Patient Registration Form
            </h2>
            <p className="mt-0.5 text-xs text-navy-300">
              Create a new patient profile for this hospital
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="mb-6 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {serverError}
        </div>
      )}

      {successId && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-health-100 bg-health-50 px-4 py-3 animate-fade-in">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-health-600" />
          <p className="text-sm text-navy-700">
            Patient registered successfully. New Patient ID:{" "}
            <span className="font-mono font-semibold">{successId}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        <section className="space-y-5">
          <p className="divider-label">Patient Information</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Patient NIC / Passport Number"
              name="nic"
              placeholder="e.g. 982345671V"
              required
              value={form.nic}
              onChange={update("nic")}
              error={errors.nic}
            />
            <Input
              label="Patient Full Name"
              name="fullName"
              placeholder="e.g. W.A. Nimal Perera"
              required
              value={form.fullName}
              onChange={update("fullName")}
              error={errors.fullName}
            />
            <Input
              label="Date of Birth"
              name="dob"
              type="date"
              required
              value={form.dob}
              onChange={update("dob")}
              error={errors.dob}
            />
            <Input
              label="Age"
              name="age"
              value={age !== null ? `${age} years` : ""}
              disabled
              hint="Auto-calculated from date of birth"
            />
            <Select
              label="Gender"
              name="gender"
              options={GENDERS}
              required
              value={form.gender}
              onChange={update("gender")}
              error={errors.gender}
            />
            <Select
              label="Blood Group"
              name="bloodGroup"
              options={BLOOD_GROUPS}
              value={form.bloodGroup}
              onChange={update("bloodGroup")}
            />
            <Input
              label="Mobile Number"
              name="mobile"
              type="tel"
              placeholder="+94 77 123 4567"
              required
              value={form.mobile}
              onChange={update("mobile")}
              error={errors.mobile}
            />
            <Input
              label="Emergency Contact"
              name="emergencyContact"
              type="tel"
              placeholder="+94 71 987 6543"
              required
              value={form.emergencyContact}
              onChange={update("emergencyContact")}
              error={errors.emergencyContact}
            />
            <div className="sm:col-span-2">
              <Input
                label="Address"
                name="address"
                placeholder="Street, city, postal code"
                required
                value={form.address}
                onChange={update("address")}
                error={errors.address}
              />
            </div>
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
            <Input
              label="Guardian Name"
              name="guardianName"
              placeholder="For minors or dependents (optional)"
              value={form.guardianName}
              onChange={update("guardianName")}
            />
            <Input
              label="Guardian Contact"
              name="guardianContact"
              type="tel"
              placeholder="Optional"
              value={form.guardianContact}
              onChange={update("guardianContact")}
            />
          </div>
        </section>

        <section className="space-y-5">
          <p className="divider-label">Medical Information</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Allergies"
              name="allergies"
              placeholder="e.g. Penicillin — leave blank if none"
              value={form.allergies}
              onChange={update("allergies")}
            />
            <Input
              label="Existing Diseases"
              name="diseases"
              placeholder="e.g. Hypertension, Diabetes"
              value={form.diseases}
              onChange={update("diseases")}
            />
            <Input
              label="Current Medications"
              name="medications"
              placeholder="e.g. Amlodipine 5mg"
              value={form.medications}
              onChange={update("medications")}
            />
            <Select
              label="Disability Status"
              name="disability"
              options={DISABILITY_OPTIONS}
              value={form.disability}
              onChange={update("disability")}
            />
            <div className="sm:col-span-2">
              <Input
                label="Special Notes"
                name="notes"
                placeholder="Anything the attending staff should know"
                value={form.notes}
                onChange={update("notes")}
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <p className="divider-label">Hospital Information</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Department"
              name="department"
              options={DEPARTMENTS}
              required
              value={form.department}
              onChange={update("department")}
              error={errors.department}
            />
            <Select
              label="Doctor"
              name="doctor"
              options={doctors.length > 0 ? doctors : ["No doctors available"]}
              value={form.doctor}
              onChange={update("doctor")}
              disabled={doctorLoading || doctors.length === 0}
              error={doctorLoadError ?? undefined}
            />
            <Select
              label="Appointment Type"
              name="appointmentType"
              options={APPOINTMENT_TYPES}
              required
              value={form.appointmentType}
              onChange={update("appointmentType")}
              error={errors.appointmentType}
            />
            <div>
              <label className="field-label">Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, priority: p }))}
                    className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      form.priority === p
                        ? p === "Emergency"
                          ? "border-rose-400 bg-rose-50 text-rose-700"
                          : "border-health-400 bg-health-50 text-health-700"
                        : "border-slate-200 bg-white text-navy-400 hover:border-slate-300"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            fullWidth={false}
            className="sm:px-6"
            onClick={() => onCheckExisting(form.nic)}
          >
            <ScanSearch size={15} />
            Check Existing Patient
          </Button>
          <Button type="button" variant="ghost" fullWidth={false} className="sm:px-6" onClick={handleClear}>
            <RotateCcw size={15} />
            Clear Form
          </Button>
          <Button type="submit" fullWidth={false} className="sm:px-8" loading={submitting}>
            Register Patient
          </Button>
        </div>
      </form>
    </div>
  );
}
