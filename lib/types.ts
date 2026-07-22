// Staff Account Types
export interface StaffAccount {
    id?: string;
    hospitalId: string;
    hospitalName: string;
    role: string;
    fullName: string;
    nic: string;
    dob: string;
    gender: string;
    mobile: string;
    email: string;
    address: string;
    department: string;
    employeeId: string;
    specialization?: string;
    medicalRegNo?: string;
    licenseNo?: string;
    joiningDate: string;
    employmentType: string;
    username: string;
    status: "Active" | "Inactive";
    photoUrl?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
}

export interface CreateStaffPayload extends Omit<StaffAccount, "id" | "createdAt" | "updatedAt"> {
    password: string;
    confirmPassword: string;
}

export interface StaffResponse {
    success: boolean;
    message: string;
    staffId?: string;
    employeeId?: string;
    error?: string;
}
