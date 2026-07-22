"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import Sidebar from "@/components/dashboard/Sidebar";
import { createStaffAccount, convertFileToBase64 } from "@/lib/staff-service";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Building2,
  Camera,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Image,
  Lock,
  Loader,
  Mail,
  Phone,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
  User,
  UserCog,
  UserPlus,
  X,
} from "lucide-react";

const ROLE_META: Record<
  string,
  {
    prefix: string;
    currentCount: number;
    allowed: string[];
    denied: string[];
  }
> = {
  Doctor: {
    prefix: "DOC",
    currentCount: 42,
    allowed: ["Patient History", "Consultation", "Diagnosis", "Prescription", "Lab Requests"],
    denied: ["Pharmacy Stock", "User Management"],
  },
  Nurse: {
    prefix: "NUR",
    currentCount: 78,
    allowed: ["Patient History", "Vitals Recording", "Medication Administration", "Appointment Management"],
    denied: ["Prescription", "Pharmacy Stock", "User Management"],
  },
  "Reception Staff": {
    prefix: "REC",
    currentCount: 15,
    allowed: ["Patient Registration", "Patient Search", "Appointment Management"],
    denied: ["Diagnosis", "Prescription", "Pharmacy Stock"],
  },
  "Pharmacy Staff": {
    prefix: "PHA",
    currentCount: 12,
    allowed: ["Pharmacy Stock", "Prescription Fulfillment", "Inventory Management"],
    denied: ["Diagnosis", "Patient Registration", "User Management"],
  },
  "Laboratory Staff": {
    prefix: "LAB",
    currentCount: 9,
    allowed: ["Lab Requests", "Lab Results Entry", "Sample Management"],
    denied: ["Prescription", "Pharmacy Stock", "User Management"],
  },
};

const DEPARTMENTS = [
  "Emergency",
  "OPD",
  "Cardiology",
  "Pediatrics",
  "Surgery",
  "Orthopedics",
  "Pharmacy",
  "Laboratory",
];

const EMPLOYMENT_TYPES = ["Permanent", "Contract", "Temporary"];
const GENDERS = ["Male", "Female", "Other"];

const SESSION_KEY = "ngemsHospitalSession";

type HospitalSession = {
  hospitalId?: string;
  hospitalName?: string;
  username?: string;
  role?: string;
};

const initialFormState = {
  role: "",
  fullName: "",
  nic: "",
  dob: "",
  gender: "",
  mobile: "",
  email: "",
  address: "",
  department: "",
  specialization: "",
  medicalRegNo: "",
  licenseNo: "",
  joiningDate: "",
  employmentType: "",
  username: "",
  status: "Active" as "Active" | "Inactive",
  password: "",
  confirmPassword: "",
};

type StaffFormState = typeof initialFormState;

type FieldErrors = Partial<Record<keyof StaffFormState, string>>;

function fieldClass(error?: string) {
  return `focus-ring w-full rounded-lg border bg-white py-2.5 px-3.5 text-sm text-navy-900 placeholder:text-navy-300/70 transition-colors duration-150 ${error ? "border-rose-300 focus-visible:ring-rose-300" : "border-slate-200 hover:border-slate-300"
    }`;
}

export default function CreateStaffPage() {
  const [form, setForm] = useState<StaffFormState>(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [successOpen, setSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hospitalSession, setHospitalSession] = useState<HospitalSession | null>(null);

  const employeeId = useMemo(() => {
    const meta = ROLE_META[form.role];
    if (!meta) return "Select a role to generate";
    return `${meta.prefix}-${String(meta.currentCount + 1).padStart(4, "0")}`;
  }, [form.role]);

  const selectedRoleMeta = ROLE_META[form.role];

  const handleChange = (key: keyof StaffFormState) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
    if (!file) {
      setPhotoPreview(null);
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!form.role) next.role = "Select a staff role.";
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.nic.trim()) next.nic = "NIC number is required.";
    if (!form.dob) next.dob = "Date of birth is required.";
    if (!form.gender) next.gender = "Select a gender.";
    if (!form.mobile.trim()) next.mobile = "Mobile number is required.";
    if (!form.email.trim()) {
      next.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.address.trim()) next.address = "Residential address is required.";
    if (!form.department) next.department = "Select a department.";
    if (!form.joiningDate) next.joiningDate = "Joining date is required.";
    if (!form.employmentType) next.employmentType = "Select an employment type.";
    if (!form.username.trim()) {
      next.username = "Choose a username.";
    } else if (form.username.length < 4) {
      next.username = "Username must be at least 4 characters.";
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
    if (form.role === "Doctor") {
      if (!form.specialization.trim()) next.specialization = "Specialization is required for doctors.";
      if (!form.medicalRegNo.trim()) next.medicalRegNo = "Medical registration number is required.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as HospitalSession;
      setHospitalSession(parsed);
    } catch {
      setHospitalSession(null);
    }
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    // Ensure employeeId is valid
    if (employeeId === "Select a role to generate" || !employeeId) {
      setApiError("Please select a valid role to generate an Employee ID.");
      return;
    }

    if (!hospitalSession?.hospitalId || !hospitalSession?.hospitalName) {
      setApiError("Hospital context is missing. Please sign in again to continue.");
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Convert photo to base64 if exists
      let photoBase64 = "";
      if (photoFile) {
        photoBase64 = await convertFileToBase64(photoFile);
      }

      const payload = {
        ...form,
        employeeId,
        hospitalId: hospitalSession.hospitalId,
        hospitalName: hospitalSession.hospitalName,
        photoBase64: photoBase64 || undefined,
        createdBy: hospitalSession.username || "Admin User",
      };


      const response = await createStaffAccount(payload);

      if (!response.success) {
        setApiError(response.error || "Failed to create staff account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessOpen(true);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setApiError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <DashboardNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7">
              <h1 className="font-display text-2xl font-semibold text-navy-900 sm:text-[26px]">
                Create Staff Account
              </h1>
              <p className="mt-1.5 text-sm text-navy-300">
                Create and manage hospital staff accounts with role-based access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
              {apiError && (
                <div className="lg:col-span-3 rounded-lg border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="mt-0.5 text-rose-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-rose-900">Error</h3>
                    <p className="text-sm text-rose-700 mt-1">{apiError}</p>
                  </div>
                  <button
                    onClick={() => setApiError(null)}
                    className="ml-auto text-rose-600 hover:text-rose-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              <div className="space-y-6 lg:col-span-2">
                <section className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
                      <UserCog size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Staff Information</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Choose the role this account will operate under.</p>
                    </div>
                  </div>

                  <div className="max-w-sm">
                    <label className="field-label" htmlFor="role">
                      Role
                      <span className="ml-0.5 text-clinical-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={handleChange("role")}
                        className={fieldClass(errors.role)}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {Object.keys(ROLE_META).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
                    </div>
                    {errors.role && (
                      <p className="field-error flex items-center gap-2">
                        <AlertCircle size={13} /> {errors.role}
                      </p>
                    )}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
                      <User size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Personal Information</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Staff member's personal details.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="field-label" htmlFor="fullName">
                        Full Name
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange("fullName")}
                        placeholder="e.g. Dr. Anjali Perera"
                        className={fieldClass(errors.fullName)}
                      />
                      {errors.fullName && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="nic">
                        NIC Number
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="nic"
                        name="nic"
                        value={form.nic}
                        onChange={handleChange("nic")}
                        placeholder="e.g. 199512345678"
                        className={fieldClass(errors.nic)}
                      />
                      {errors.nic && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.nic}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="dob">
                        Date of Birth
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={form.dob}
                        onChange={handleChange("dob")}
                        className={fieldClass(errors.dob)}
                      />
                      {errors.dob && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.dob}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="gender">
                        Gender
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          name="gender"
                          value={form.gender}
                          onChange={handleChange("gender")}
                          className={fieldClass(errors.gender)}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {GENDERS.map((gender) => (
                            <option key={gender} value={gender}>
                              {gender}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
                      </div>
                      {errors.gender && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="mobile">
                        Mobile Number
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={form.mobile}
                          onChange={handleChange("mobile")}
                          placeholder="+94 77 123 4567"
                          className={`${fieldClass(errors.mobile)} pl-10`}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.mobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="email">
                        Email Address
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange("email")}
                          placeholder="staff@hospital.gov"
                          className={`${fieldClass(errors.email)} pl-10`}
                        />
                      </div>
                      {errors.email && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="field-label" htmlFor="address">
                        Residential Address
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange("address")}
                        placeholder="Street, city, postal code"
                        className={fieldClass(errors.address)}
                      />
                      {errors.address && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
                      <Briefcase size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Professional Information</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Department, credentials, and employment details.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="department">
                        Department
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="department"
                          name="department"
                          value={form.department}
                          onChange={handleChange("department")}
                          className={fieldClass(errors.department)}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {DEPARTMENTS.map((department) => (
                            <option key={department} value={department}>
                              {department}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
                      </div>
                      {errors.department && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.department}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label">
                        Employee ID
                        <span className="font-normal normal-case text-navy-300">(auto-generated)</span>
                      </label>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-150 bg-slate-50 px-3.5 py-2.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-navy-700">
                          <Lock size={14} className="text-navy-300" />
                          <span>{employeeId}</span>
                        </div>
                      </div>
                    </div>

                    {form.role === "Doctor" && (
                      <>
                        <div>
                          <label className="field-label" htmlFor="specialization">
                            Specialization
                            <span className="ml-0.5 text-clinical-500">*</span>
                          </label>
                          <input
                            id="specialization"
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange("specialization")}
                            placeholder="e.g. Cardiothoracic Surgery"
                            className={fieldClass(errors.specialization)}
                          />
                          {errors.specialization && (
                            <p className="field-error flex items-center gap-2">
                              <AlertCircle size={13} /> {errors.specialization}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="field-label" htmlFor="medicalRegNo">
                            Medical Registration Number
                            <span className="ml-0.5 text-clinical-500">*</span>
                          </label>
                          <input
                            id="medicalRegNo"
                            name="medicalRegNo"
                            value={form.medicalRegNo}
                            onChange={handleChange("medicalRegNo")}
                            placeholder="e.g. SLMC 45231"
                            className={fieldClass(errors.medicalRegNo)}
                          />
                          {errors.medicalRegNo && (
                            <p className="field-error flex items-center gap-2">
                              <AlertCircle size={13} /> {errors.medicalRegNo}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="field-label" htmlFor="licenseNo">
                        License Number
                      </label>
                      <input
                        id="licenseNo"
                        name="licenseNo"
                        value={form.licenseNo}
                        onChange={handleChange("licenseNo")}
                        placeholder="Optional"
                        className={fieldClass()}
                      />
                      <p className="field-hint">Leave blank if not applicable</p>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="joiningDate">
                        Joining Date
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="joiningDate"
                        name="joiningDate"
                        type="date"
                        value={form.joiningDate}
                        onChange={handleChange("joiningDate")}
                        className={fieldClass(errors.joiningDate)}
                      />
                      {errors.joiningDate && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.joiningDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="employmentType">
                        Employment Type
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="employmentType"
                          name="employmentType"
                          value={form.employmentType}
                          onChange={handleChange("employmentType")}
                          className={fieldClass(errors.employmentType)}
                        >
                          <option value="" disabled>
                            Select an option
                          </option>
                          {EMPLOYMENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
                      </div>
                      {errors.employmentType && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.employmentType}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
                      <Lock size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Account Information</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Login credentials for this staff account.</p>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="field-label" htmlFor="username">
                        Username
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange("username")}
                        placeholder="Choose a unique username"
                        className={fieldClass(errors.username)}
                      />
                      {errors.username && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="status">
                        Status
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          name="status"
                          value={form.status}
                          onChange={handleChange("status")}
                          className={fieldClass()}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
                      </div>
                    </div>

                    <div>
                      <label className="field-label" htmlFor="password">
                        Password
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange("password")}
                          placeholder="At least 8 characters"
                          className={`${fieldClass(errors.password)} pl-10 pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-clinical-500"
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label" htmlFor="confirmPassword">
                        Confirm Password
                        <span className="ml-0.5 text-clinical-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={form.confirmPassword}
                          onChange={handleChange("confirmPassword")}
                          placeholder="Re-enter password"
                          className={`${fieldClass(errors.confirmPassword)} pl-10 pr-10`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((current) => !current)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-clinical-500"
                        >
                          {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="field-error flex items-center gap-2">
                          <AlertCircle size={13} /> {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="field-label">Role</label>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-150 bg-slate-50 px-3.5 py-2.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-navy-700">
                          <UserCog size={14} className="text-navy-300" />
                          <span>{form.role || "Not selected"}</span>
                        </div>
                        <Lock size={13} className="text-navy-300" />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Hospital</label>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-150 bg-slate-50 px-3.5 py-2.5">
                        <div className="flex items-center gap-2 text-sm font-medium text-navy-700">
                          <Building2 size={14} className="text-navy-300" /> {hospitalSession?.hospitalName || "National Hospital Colombo"}
                        </div>
                        <Lock size={13} className="text-navy-300" />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Hospital ID</label>
                      <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-150 bg-slate-50 px-3.5 py-2.5">
                        <span className="text-sm font-medium text-navy-700">{hospitalSession?.hospitalId || "HOS-0001"}</span>
                        <Lock size={13} className="text-navy-300" />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-6 flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-clinical-50 text-clinical-600">
                      <Camera size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Profile Photo</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Add a staff ID photo for the hospital directory.</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <div className="relative shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-200 bg-slate-50">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                        ) : (
                          <Image size={26} className="text-navy-300" />
                        )}
                      </div>
                      {photoPreview && (
                        <button
                          type="button"
                          onClick={() => handlePhotoChange(null)}
                          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm hover:bg-rose-600"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                    <div
                      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center hover:border-slate-300 w-full"
                      onClick={() => document.getElementById("photoInput")?.click()}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.currentTarget.classList.add("border-clinical-400", "bg-clinical-50");
                      }}
                      onDragLeave={(event) => {
                        event.currentTarget.classList.remove("border-clinical-400", "bg-clinical-50");
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        event.currentTarget.classList.remove("border-clinical-400", "bg-clinical-50");
                        const file = event.dataTransfer.files[0];
                        if (file) handlePhotoChange(file);
                      }}
                    >
                      <UploadCloud size={20} className="text-clinical-500" />
                      <p className="text-sm font-medium text-navy-700">
                        Drag & drop staff photo, or <span className="text-clinical-600 underline underline-offset-2">browse</span>
                      </p>
                      <p className="text-xs text-navy-300">PNG or JPG, square image recommended, up to 2MB</p>
                      <input
                        id="photoInput"
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(event) => handlePhotoChange(event.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCcw size={15} /> Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => resetForm()}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center rounded-lg bg-transparent px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={15} className="animate-spin" /> Creating...
                      </>
                    ) : (
                      "Create Staff Account"
                    )}
                  </button>
                </div>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden rounded-2xl border border-slate-150 bg-white shadow-card">
                  <div className="relative bg-navy-900 px-6 py-6" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)", backgroundSize: "14px 14px" }}>
                    <div className="relative z-10 flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white">
                        <Building2 size={22} />
                      </span>
                      <div>
                        <p className="font-display text-sm font-semibold leading-tight text-white">
                          {hospitalSession?.hospitalName || "Hospital"}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] tracking-wide text-white/50">
                          {hospitalSession?.hospitalId || "Unknown ID"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 px-6 py-4">
                    <div className="flex items-center justify-between py-2.5">
                      <span className="flex items-center gap-2 text-sm text-navy-300">
                        <UserCog size={15} /> Created by
                      </span>
                      <span className="text-sm font-medium text-navy-800">Admin User</span>
                    </div>
                    <div className="flex items-center justify-between py-2.5">
                      <span className="flex items-center gap-2 text-sm text-navy-300">
                        <UserPlus size={15} /> Current staff
                      </span>
                      <span className="text-sm font-semibold text-clinical-600">125</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-150 bg-white p-6 shadow-card">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-health-50 text-health-600">
                      <ShieldCheck size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-navy-900">Permissions Preview</h2>
                      <p className="mt-0.5 text-xs text-navy-300">Access granted by selected role.</p>
                    </div>
                  </div>
                  {!form.role ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-navy-300">
                      Select a role in Staff Information to preview system access.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <span className="inline-flex items-center rounded-full bg-clinical-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-clinical-700">
                        {form.role}
                      </span>
                      <ul className="space-y-2">
                        {selectedRoleMeta?.allowed.map((perm) => (
                          <li key={perm} className="flex items-center gap-2 text-sm text-navy-700">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-health-50 text-health-600">
                              <Check size={12} />
                            </span>
                            {perm}
                          </li>
                        ))}
                        {selectedRoleMeta?.denied.map((perm) => (
                          <li key={perm} className="flex items-center gap-2 text-sm text-navy-300">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-50 text-rose-400">
                              <X size={12} />
                            </span>
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </aside>
            </form>
          </div>
        </main>
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-150 bg-white p-8 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-health-50">
              <Check size={30} className="text-health-600" />
            </div>
            <h2 className="font-display text-xl font-semibold text-navy-900">Staff Account Created</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-300">
              <span className="font-medium text-navy-700">{form.fullName || "The staff member"}</span> has been added as
              <span className="font-medium text-navy-700"> {form.role || "staff"}</span> and can now sign in with their assigned credentials.
            </p>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <span className="text-xs font-medium uppercase tracking-wide text-navy-300">Employee ID</span>
              <span className="font-mono text-sm font-semibold text-navy-800">{employeeId}</span>
            </div>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSuccessOpen(false);
                  resetForm();
                }}
                className="inline-flex items-center justify-center rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Create Another Staff Account
              </button>
              <button
                type="button"
                onClick={() => setSuccessOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-transparent px-6 py-3 text-sm font-semibold text-navy-700 transition hover:bg-slate-100"
              >
                Back to Staff Management
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
