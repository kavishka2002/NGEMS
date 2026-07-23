export const hospital = {
  name: "National Hospital Colombo",
  id: "HOS-0001",
  type: "Government General Hospital — Tertiary Care",
  province: "Western Province",
  district: "Colombo",
  address: "No. 383, Kynsey Road, Colombo 08",
  contact: "+94 11 269 1111",
  email: "admin@nhc.health.gov.lk",
  status: "Approved" as const,
  registeredOn: "14 Jan 2019",
};

export const overviewStats = [
  { key: "staff", label: "Total Staff", value: 125, delta: "+4 this month", icon: "Users" },
  { key: "doctors", label: "Total Doctors", value: 35, delta: "+1 this month", icon: "Stethoscope" },
  { key: "patients", label: "Total Patients", value: 2500, delta: "+150 this month", icon: "HeartPulse" },
  { key: "appointments", label: "Today's Appointments", value: 320, delta: "18 pending", icon: "CalendarCheck" },
  { key: "admissions", label: "Current Admissions", value: 120, delta: "20 today", icon: "BedDouble" },
  { key: "beds", label: "Available Beds", value: 45, delta: "of 165 total", icon: "BedSingle" },
];

export const staffOverview = [
  { role: "Doctors", count: 35 },
  { role: "Nurses", count: 70 },
  { role: "Pharmacy Staff", count: 10 },
  { role: "Laboratory Staff", count: 8 },
  { role: "Reception Staff", count: 5 },
];

export const todaysActivity = [
  { label: "New Patients", value: 150, icon: "UserPlus" },
  { label: "Consultations", value: 320, icon: "Stethoscope" },
  { label: "Lab Tests", value: 85, icon: "FlaskConical" },
  { label: "Medicines Issued", value: 450, icon: "Pill" },
  { label: "Admissions", value: 20, icon: "BedDouble" },
];

export const patientTrend = [
  { month: "Jan", patients: 1820 },
  { month: "Feb", patients: 1960 },
  { month: "Mar", patients: 2040 },
  { month: "Apr", patients: 2110 },
  { month: "May", patients: 2260 },
  { month: "Jun", patients: 2340 },
  { month: "Jul", patients: 2500 },
];

export const monthlyAdmissions = [
  { month: "Jan", admissions: 96 },
  { month: "Feb", admissions: 104 },
  { month: "Mar", admissions: 88 },
  { month: "Apr", admissions: 112 },
  { month: "May", admissions: 130 },
  { month: "Jun", admissions: 118 },
  { month: "Jul", admissions: 120 },
];

export const medicineUsage = [
  { name: "Paracetamol", value: 32 },
  { name: "Antibiotics", value: 24 },
  { name: "Antihypertensives", value: 18 },
  { name: "Insulin", value: 12 },
  { name: "Other", value: 14 },
];

export const diseaseStats = [
  { disease: "Respiratory", cases: 410 },
  { disease: "Cardiovascular", cases: 355 },
  { disease: "Diabetes", cases: 300 },
  { disease: "Dengue", cases: 190 },
  { disease: "Renal", cases: 140 },
];

export const doctor = {
  name: "Dr. Kasun Perera",
  specialization: "Consultant Physician",
  status: "Available",
};

export const patients = [
  {
    id: "PAT-100245",
    name: "Nimali Fernando",
    age: 42,
    gender: "Female",
    phone: "+94 77 123 4567",
    nic: "199514567V",
    lastVisit: "18 Jul 2026",
    diagnosis: "Hypertension",
    status: "Active",
    blood: "O+",
    allergies: "None",
    medication: "Amlodipine 5mg",
  },
  {
    id: "PAT-100246",
    name: "Saman Kumara",
    age: 58,
    gender: "Male",
    phone: "+94 77 765 4321",
    nic: "197823456A",
    lastVisit: "20 Jul 2026",
    diagnosis: "Type 2 Diabetes",
    status: "Follow-up",
    blood: "A+",
    allergies: "Penicillin",
    medication: "Metformin 500mg",
  },
  {
    id: "PAT-100247",
    name: "Tharushi Silva",
    age: 29,
    gender: "Female",
    phone: "+94 71 987 6543",
    nic: "200315678V",
    lastVisit: "19 Jul 2026",
    diagnosis: "Migraine",
    status: "Waiting",
    blood: "B+",
    allergies: "None",
    medication: "Paracetamol",
  },
];

export const queue = [
  { no: "Q-01", patient: "Nimali Fernando", id: "PAT-100245", age: 42, gender: "Female", time: "08:30", reason: "Blood pressure review", priority: "Urgent", status: "Waiting" },
  { no: "Q-02", patient: "Saman Kumara", id: "PAT-100246", age: 58, gender: "Male", time: "09:15", reason: "Diabetes follow-up", priority: "Normal", status: "Called" },
  { no: "Q-03", patient: "Tharushi Silva", id: "PAT-100247", age: 29, gender: "Female", time: "10:00", reason: "Headache assessment", priority: "Waiting", status: "In Consultation" },
  { no: "Q-04", patient: "Mohamed Rizwan", id: "PAT-100248", age: 35, gender: "Male", time: "10:45", reason: "Chest pain", priority: "Emergency", status: "Waiting" },
];

export const appointments = [
  { id: "APT-2026-001", patient: "Nimali Fernando", patientId: "PAT-100245", date: "22 Jul 2026", time: "08:30", type: "Follow-up", reason: "Blood pressure review", status: "Confirmed" },
  { id: "APT-2026-002", patient: "Saman Kumara", patientId: "PAT-100246", date: "22 Jul 2026", time: "09:15", type: "Routine", reason: "Diabetes check", status: "Confirmed" },
  { id: "APT-2026-003", patient: "Tharushi Silva", patientId: "PAT-100247", date: "22 Jul 2026", time: "10:00", type: "Urgent", reason: "Migraine review", status: "Pending" },
];

export const notifications = [
  { id: "N-01", title: "Lab results ready for Nimali Fernando", description: "View the new report in Laboratory.", time: "2 min ago", unread: true },
  { id: "N-02", title: "Appointment confirmed for Saman Kumara", description: "09:15 follow-up confirmed.", time: "10 min ago", unread: false },
  { id: "N-03", title: "New patient registration pending review", description: "Review patient details before consultation.", time: "30 min ago", unread: false },
];

export const prescriptions = [
  { id: "RX-2026-001", patient: "Nimali Fernando", patientId: "PAT-100245", medication: "Amlodipine", dosage: "5mg", frequency: "Once daily", prescribedBy: "Dr. Kasun Perera", date: "18 Jul 2026", status: "Active" },
  { id: "RX-2026-002", patient: "Saman Kumara", patientId: "PAT-100246", medication: "Metformin", dosage: "500mg", frequency: "Twice daily", prescribedBy: "Dr. Kasun Perera", date: "20 Jul 2026", status: "Active" },
  { id: "RX-2026-003", patient: "Tharushi Silva", patientId: "PAT-100247", medication: "Paracetamol", dosage: "500mg", frequency: "As needed", prescribedBy: "Dr. Kasun Perera", date: "19 Jul 2026", status: "Review" },
];

export const laboratoryTests = [
  { id: "LAB-001", patient: "Nimali Fernando", patientId: "PAT-100245", test: "Full blood count", result: "Normal", status: "Completed", date: "18 Jul 2026" },
  { id: "LAB-002", patient: "Saman Kumara", patientId: "PAT-100246", test: "HbA1c", result: "8.1%", status: "Completed", date: "20 Jul 2026" },
  { id: "LAB-003", patient: "Tharushi Silva", patientId: "PAT-100247", test: "Electrolytes", result: "Slightly low potassium", status: "Review", date: "19 Jul 2026" },
];

export const radiologyReports = [
  { id: "RAD-1001", patient: "Mohamed Rizwan", patientId: "PAT-100248", study: "Chest X-ray", findings: "Suspicious infiltrate in left lower lobe", status: "Available", date: "22 Jul 2026" },
  { id: "RAD-1002", patient: "Nimali Fernando", patientId: "PAT-100245", study: "Abdominal ultrasound", findings: "Mild hepatomegaly", status: "Pending", date: "21 Jul 2026" },
];

export const admissions = [
  { admissionId: "ADM-101", patient: "Nimali Fernando", patientId: "PAT-100245", ward: "Medical Ward 5", bed: "B12", admittedOn: "18 Jul 2026", reason: "Hypertension review", status: "Stable" },
  { admissionId: "ADM-102", patient: "Saman Kumara", patientId: "PAT-100246", ward: "Endocrine Ward", bed: "E03", admittedOn: "20 Jul 2026", reason: "Diabetes monitoring", status: "Under observation" },
];

export const referrals = [
  { id: "REF-110", patient: "Tharushi Silva", patientId: "PAT-100247", referredTo: "Neurology", reason: "Recurrent migraine", status: "Sent", date: "19 Jul 2026" },
  { id: "REF-111", patient: "Mohamed Rizwan", patientId: "PAT-100248", referredTo: "Cardiology", reason: "Chest pain evaluation", status: "Pending", date: "22 Jul 2026" },
];

export const medicalNotes = [
  { id: "NOTE-001", patient: "Nimali Fernando", patientId: "PAT-100245", note: "Continue antihypertensive therapy and follow up in 1 week.", author: "Dr. Kasun Perera", date: "18 Jul 2026" },
  { id: "NOTE-002", patient: "Saman Kumara", patientId: "PAT-100246", note: "Increase exercise and adjust Metformin if glucose remains elevated.", author: "Dr. Kasun Perera", date: "20 Jul 2026" },
];

export const schedule = [
  { id: "SCH-01", date: "22 Jul 2026", time: "08:30", type: "Morning Clinic", patient: "Nimali Fernando", status: "Confirmed" },
  { id: "SCH-02", date: "22 Jul 2026", time: "09:15", type: "Consultation", patient: "Saman Kumara", status: "Confirmed" },
  { id: "SCH-03", date: "22 Jul 2026", time: "10:00", type: "Urgent Review", patient: "Tharushi Silva", status: "Pending" },
];

export const doctorProfile = {
  name: "Dr. Kasun Perera",
  specialization: "Consultant Physician",
  department: "Internal Medicine",
  email: "kasun.perera@nhc.health.gov.lk",
  phone: "+94 77 222 3344",
  experience: "12 years",
  status: "Available",
};

export const sidebarSections = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: "LayoutDashboard", href: "#" },
      { name: "Hospital Profile", icon: "Building2", href: "#" },
    ],
  },
  {
    label: "Staff Management",
    items: [
      { name: "Doctors", icon: "Stethoscope", href: "#" },
      { name: "Nurses", icon: "HeartPulse", href: "#" },
      { name: "Pharmacy Staff", icon: "Pill", href: "#" },
      { name: "Laboratory Staff", icon: "FlaskConical", href: "#" },
      { name: "Reception Staff", icon: "UserRound", href: "#" },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Departments", icon: "Building", href: "/dashboard/departments" },
      { name: "Patients", icon: "Users", href: "/dashboard/patients" },
      { name: "Appointments", icon: "CalendarCheck", href: "/dashboard/appointments" },
      { name: "Admissions", icon: "BedDouble", href: "/dashboard/admissions" },
      { name: "Pharmacy", icon: "Pill", href: "/pharmacy/dashboard" },
      { name: "Laboratory", icon: "FlaskConical", href: "/laboratory/dashboard" },
    ],
  },
  {
    label: "System",
    items: [
      { name: "Reports", icon: "FileBarChart2", href: "#" },
      { name: "Settings", icon: "Settings", href: "#" },
    ],
  },
];
