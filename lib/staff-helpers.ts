// Helper functions and utilities for staff and hospital management

export interface HospitalContext {
    hospitalId: string;
    hospitalName: string;
    adminId: string;
    adminName: string;
}

export interface UserContext {
    uid: string;
    email: string;
    displayName: string;
    role: string;
}

// This should be obtained from your authentication/context system
// For now, this is a mock implementation
export function getHospitalContext(): HospitalContext {
    // TODO: Replace with actual context from Redux/Context API/Session
    return {
        hospitalId: "HOS-0001",
        hospitalName: "National Hospital Colombo",
        adminId: "admin-001",
        adminName: "Admin User",
    };
}

export function getUserContext(): UserContext {
    // TODO: Replace with actual user context from Firebase Auth
    return {
        uid: "admin-001",
        email: "admin@hospital.gov",
        displayName: "Admin User",
        role: "admin",
    };
}

// Role metadata for generating employee IDs
export const ROLE_PREFIXES: Record<string, string> = {
    Doctor: "DOC",
    Nurse: "NUR",
    "Reception Staff": "REC",
    "Pharmacy Staff": "PHA",
    "Laboratory Staff": "LAB",
    "Admin Staff": "ADM",
};

// Permissions by role
export const ROLE_PERMISSIONS: Record<
    string,
    {
        prefix: string;
        allowed: string[];
        denied: string[];
    }
> = {
    Doctor: {
        prefix: "DOC",
        allowed: [
            "Patient History",
            "Consultation",
            "Diagnosis",
            "Prescription",
            "Lab Requests",
        ],
        denied: ["Pharmacy Stock", "User Management"],
    },
    Nurse: {
        prefix: "NUR",
        allowed: [
            "Patient History",
            "Vitals Recording",
            "Medication Administration",
            "Appointment Management",
        ],
        denied: ["Prescription", "Pharmacy Stock", "User Management"],
    },
    "Reception Staff": {
        prefix: "REC",
        allowed: [
            "Patient Registration",
            "Patient Search",
            "Appointment Management",
        ],
        denied: ["Diagnosis", "Prescription", "Pharmacy Stock"],
    },
    "Pharmacy Staff": {
        prefix: "PHA",
        allowed: [
            "Pharmacy Stock",
            "Prescription Fulfillment",
            "Inventory Management",
        ],
        denied: ["Diagnosis", "Patient Registration", "User Management"],
    },
    "Laboratory Staff": {
        prefix: "LAB",
        allowed: ["Lab Requests", "Lab Results Entry", "Sample Management"],
        denied: ["Prescription", "Pharmacy Stock", "User Management"],
    },
};

// Constants
export const DEPARTMENTS = [
    "Emergency",
    "OPD",
    "Cardiology",
    "Pediatrics",
    "Surgery",
    "Orthopedics",
    "Pharmacy",
    "Laboratory",
];

export const EMPLOYMENT_TYPES = ["Permanent", "Contract", "Temporary"];
export const GENDERS = ["Male", "Female", "Other"];

// Validation utilities
export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateUsername(username: string): boolean {
    return username.length >= 4 && /^[a-zA-Z0-9_-]+$/.test(username);
}

export function validatePassword(password: string): boolean {
    return password.length >= 8;
}

export function validateNIC(nic: string): boolean {
    return nic.length === 12 && /^\d{12}$/.test(nic);
}

export function validateMobileNumber(mobile: string): boolean {
    return /^[0-9+\s\-()]{10,}$/.test(mobile);
}
