export type Prescription = {
  id: string;
  patientName: string;
  patientId: string;
  doctorName?: string;
  medicines: string[];
  dateIssued?: string;
  status?: string;
};

const DEFAULT_HOSPITAL = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'NGEMS-HOS-2026-922107';

function getHospitalId() {
  try {
    const configuredId = (window as any).__NGEMS_HOSPITAL_ID;
    if (typeof configuredId === 'string' && configuredId.trim()) return configuredId.trim();

    const rawSession = window.localStorage.getItem('ngemsHospitalSession');
    if (rawSession) {
      const session = JSON.parse(rawSession) as { hospitalId?: unknown };
      if (typeof session.hospitalId === 'string' && session.hospitalId.trim()) {
        return session.hospitalId.trim();
      }
    }

    return DEFAULT_HOSPITAL;
  } catch {
    return DEFAULT_HOSPITAL;
  }
}

async function api(path: string, opts: RequestInit = {}){
  const res = await fetch(path, opts);
  if(!res.ok) throw new Error(await res.text());
  return res.json();
}

export type PharmacyReport = {
  prescriptions: number;
  dispensings: number;
  inventoryItems: number;
  patients: number;
};

export type PharmacyDashboardSummary = {
  pendingPrescriptions: number;
  dispensedToday: number;
  totalMedicines: number;
  lowStockAlerts: number;
  expiredMedicines: number;
};

export async function getDashboardSummary(): Promise<PharmacyDashboardSummary> {
  const hospitalId = getHospitalId();
  const data = await api(`/api/pharmacy/dashboard?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data;
}

export async function getPrescriptions(){
  const hospitalId = getHospitalId();
  const data = await api(`/api/prescriptions?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data || [];
}

export async function updatePrescription(id: string, body: any){
  const res = await api(`/api/prescriptions?id=${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res;
}

export async function dispensePrescription(prescriptionId: string){
  const hospitalId = getHospitalId();
  const res = await api(`/api/dispensing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hospitalId, prescriptionId, items: [] }) });
  return res;
}

export async function getDispensing(){
  const hospitalId = getHospitalId();
  const data = await api(`/api/dispensing?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data || [];
}

export type Medicine = {
  id: string;
  name: string;
  quantity: number;
  minStock?: number;
  unit?: string;
  price?: number;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TransactionHistory = {
  id: string;
  medicineName: string;
  type: "dispensed" | "added" | "adjusted" | "deleted";
  quantity: number;
  unit?: string;
  reason: string;
  operator: string;
  timestamp: string;
};

export async function getPharmacyHistory(): Promise<TransactionHistory[]> {
  const hospitalId = getHospitalId();
  const data = await api(`/api/pharmacy/history?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data || [];
}

export async function getInventory(){
  const hospitalId = getHospitalId();
  const data = await api(`/api/inventory?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data || [];
}

export async function createInventoryItem(item: Partial<Medicine>){
  const hospitalId = getHospitalId();
  const body = { hospitalId, ...item };
  const res = await api('/api/inventory', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return res;
}

export async function updateInventoryItem(id: string, item: Partial<Medicine>){
  const hospitalId = getHospitalId();
  const res = await api(`/api/inventory?id=${encodeURIComponent(id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hospitalId, ...item }) });
  return res;
}

export async function deleteInventoryItem(id: string){
  const hospitalId = getHospitalId();
  return api(`/api/inventory?id=${encodeURIComponent(id)}&hospitalId=${encodeURIComponent(hospitalId)}`, { method: 'DELETE' });
}

export async function getStockAlerts(){
  const hospitalId = getHospitalId();
  const data = await api(`/api/stock-alerts?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.data || [];
}

export async function getReports(){
  const hospitalId = getHospitalId();
  const data = await api(`/api/reports?hospitalId=${encodeURIComponent(hospitalId)}`);
  return data.report || {};
}

export default { getPrescriptions, getDashboardSummary, updatePrescription, dispensePrescription, getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem, getStockAlerts, getReports, getPharmacyHistory };
