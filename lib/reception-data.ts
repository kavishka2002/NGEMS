// Demo data only — no backend/database. Used to simulate the "existing patient
// found" experience for the Reception Dashboard UI.

export type Patient = {
  id: string;
  nic: string;
  passport?: string;
  mobile: string;
  name: string;
  dob: string; // ISO date
  gender: string;
  bloodGroup: string;
  regDate: string;
  status: "Active" | "Inactive";
  alerts: string[];
};

export type Visit = {
  date: string;
  hospital: string;
  doctor: string;
  diagnosis: string;
  note: string;
  status: "Completed" | "Ongoing";
};

export type Medicine = {
  name: string;
  dosage: string;
  duration: string;
  hospital: string;
  doctor: string;
  status: "Active" | "Completed";
};

export type LabReport = {
  name: string;
  hospital: string;
  doctor: string;
  date: string;
  status: "Completed" | "Pending";
};

export type HospitalVisit = {
  hospital: string;
  date: string;
  department: string;
  doctor: string;
  diagnosis: string;
  admissionDays: number;
  dischargeDate: string;
};

export type PatientRecord = {
  patient: Patient;
  visits: Visit[];
  medicines: Medicine[];
  labReports: LabReport[];
  hospitalHistory: HospitalVisit[];
};

// Single fully-populated demo record — search "982345671V" or "PAT-02114".
export const DEMO_RECORD: PatientRecord = {
  patient: {
    id: "PAT-02114",
    nic: "982345671V",
    mobile: "+94 77 234 5678",
    name: "W.A. Nimal Perera",
    dob: "1968-04-12",
    gender: "Male",
    bloodGroup: "O+",
    regDate: "14 Mar 2022",
    status: "Active",
    alerts: ["Penicillin Allergy"],
  },
  visits: [
    {
      date: "01 Jul 2026",
      hospital: "National Hospital Colombo",
      doctor: "Dr. Silva",
      diagnosis: "Hypertension",
      note: "Prescription",
      status: "Completed",
    },
    {
      date: "10 May 2026",
      hospital: "Teaching Hospital Kandy",
      doctor: "Dr. Perera",
      diagnosis: "Diabetes",
      note: "Lab Report Available",
      status: "Completed",
    },
  ],
  medicines: [
    {
      name: "Amlodipine 5mg",
      dosage: "1 tablet, once daily",
      duration: "30 days",
      hospital: "National Hospital Colombo",
      doctor: "Dr. Silva",
      status: "Active",
    },
    {
      name: "Metformin 500mg",
      dosage: "1 tablet, twice daily",
      duration: "60 days",
      hospital: "Teaching Hospital Kandy",
      doctor: "Dr. Perera",
      status: "Completed",
    },
  ],
  labReports: [
    {
      name: "Lipid Profile",
      hospital: "National Hospital Colombo",
      doctor: "Dr. Silva",
      date: "01 Jul 2026",
      status: "Completed",
    },
    {
      name: "Fasting Blood Sugar",
      hospital: "Teaching Hospital Kandy",
      doctor: "Dr. Perera",
      date: "10 May 2026",
      status: "Completed",
    },
  ],
  hospitalHistory: [
    {
      hospital: "National Hospital Colombo",
      date: "01 Jul 2026",
      department: "OPD · Cardiology",
      doctor: "Dr. Silva",
      diagnosis: "Hypertension",
      admissionDays: 0,
      dischargeDate: "Same day (OPD)",
    },
    {
      hospital: "Teaching Hospital Kandy",
      date: "10 May 2026",
      department: "Medical Ward",
      doctor: "Dr. Perera",
      diagnosis: "Type 2 Diabetes Mellitus",
      admissionDays: 3,
      dischargeDate: "13 May 2026",
    },
  ],
};

// Lookup keys that resolve to the demo record.
export const DEMO_KEYS = ["982345671V", "PAT-02114", "+94 77 234 5678", "0772345678"];

export function calcAge(dob: string): number {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export const PROVINCES = [
  "Western", "Central", "Southern", "Northern", "Eastern",
  "North Western", "North Central", "Uva", "Sabaragamuwa",
];

export const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle", "Jaffna",
  "Kurunegala", "Anuradhapura", "Badulla", "Ratnapura",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

export const DEPARTMENTS = [
  "OPD", "Emergency", "Cardiology", "Pediatrics", "Surgery", "Orthopedics", "Pharmacy", "Laboratory",
];

export const DOCTORS = [
  "Dr. Silva", "Dr. Perera", "Dr. Fernando", "Dr. Jayasuriya", "Dr. Wickramasinghe",
];
