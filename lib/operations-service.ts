export type OperationRecord = Record<string, any>;

async function fetchOperationRecords(operation: string, hospitalId: string): Promise<OperationRecord[]> {
    try {
        const response = await fetch(`/api/${operation}?hospitalId=${encodeURIComponent(hospitalId)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to fetch ${operation}`);
        }

        return data.data || [];
    } catch (error) {
        console.error(`Error fetching ${operation}:`, error);
        return [];
    }
}

async function postOperationRecord(operation: string, payload: Record<string, unknown>): Promise<OperationRecord> {
    try {
        const response = await fetch(`/api/${operation}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `Failed to create ${operation}`);
        }

        return data.data;
    } catch (error) {
        console.error(`Error creating ${operation}:`, error);
        throw error;
    }
}

export function getDepartments(hospitalId: string) {
    return fetchOperationRecords("departments", hospitalId);
}

export function getPatients(hospitalId: string) {
    return fetchOperationRecords("patients", hospitalId);
}

export function getAppointments(hospitalId: string) {
    return fetchOperationRecords("appointments", hospitalId);
}

export function getAdmissions(hospitalId: string) {
    return fetchOperationRecords("admissions", hospitalId);
}

export function createDepartment(hospitalId: string, payload: Record<string, unknown>) {
    return postOperationRecord("departments", { hospitalId, ...payload });
}

export function createPatient(hospitalId: string, payload: Record<string, unknown>) {
    return postOperationRecord("patients", { hospitalId, ...payload });
}

export function createAppointment(hospitalId: string, payload: Record<string, unknown>) {
    return postOperationRecord("appointments", { hospitalId, ...payload });
}

export function createAdmission(hospitalId: string, payload: Record<string, unknown>) {
    return postOperationRecord("admissions", { hospitalId, ...payload });
}
