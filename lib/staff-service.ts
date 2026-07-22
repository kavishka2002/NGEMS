import { StaffAccount, CreateStaffPayload, StaffResponse } from "./types";

export async function createStaffAccount(payload: CreateStaffPayload): Promise<StaffResponse> {
    try {
        const response = await fetch("/api/staff", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to create staff account");
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: errorMessage,
            error: errorMessage,
        };
    }
}

export async function getStaffList(hospitalId: string, role?: string): Promise<StaffAccount[]> {
    try {
        const params = new URLSearchParams({ hospitalId });
        if (role) {
            params.append("role", role);
        }

        const response = await fetch(`/api/staff?${params.toString()}`);

        if (!response.ok) {
            throw new Error("Failed to fetch staff list");
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching staff list:", error);
        return [];
    }
}

export async function getStaffMemberById(staffId: string): Promise<StaffAccount | null> {
    try {
        const response = await fetch(`/api/staff/${staffId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch staff member");
        }

        const data = await response.json();
        return data.data || null;
    } catch (error) {
        console.error("Error fetching staff member:", error);
        return null;
    }
}

export async function updateStaffAccount(
    staffId: string,
    updates: Partial<StaffAccount>
): Promise<StaffResponse> {
    try {
        const response = await fetch(`/api/staff/${staffId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update staff account");
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: errorMessage,
            error: errorMessage,
        };
    }
}

export async function deleteStaffAccount(staffId: string): Promise<StaffResponse> {
    try {
        const response = await fetch(`/api/staff/${staffId}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to delete staff account");
        }

        return data;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return {
            success: false,
            message: errorMessage,
            error: errorMessage,
        };
    }
}

export async function deactivateStaffAccount(staffId: string): Promise<StaffResponse> {
    return updateStaffAccount(staffId, { status: "Inactive" });
}

export async function reactivateStaffAccount(staffId: string): Promise<StaffResponse> {
    return updateStaffAccount(staffId, { status: "Active" });
}

// Utility functions for photo handling
export async function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

// Generate employee ID based on role
export function generateEmployeeId(rolePrefix: string, count: number): string {
    return `${rolePrefix}-${String(count + 1).padStart(4, "0")}`;
}
