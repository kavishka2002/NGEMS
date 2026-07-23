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

// NOTE: Demo-specific sample record removed. Reception UI should use
// Firestore-backed APIs via `/api/patients` and `/api/staff` instead of
// relying on in-repo demo constants.

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
