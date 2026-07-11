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
