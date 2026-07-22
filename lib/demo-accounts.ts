// Demo accounts for testing N-GEMS application
export const DEMO_ACCOUNTS = {
  reception: {
    hospitalId: "NGEMS-HOS-2026-000000",
    username: "reception",
    password: "demo123",
    role: "Reception Staff",
    description: "Patient intake and appointments"
  },
  pharmacy: {
    hospitalId: "NGEMS-HOS-2026-000000",
    username: "pharmacy",
    password: "demo123",
    role: "Pharmacy Staff",
    description: "Medication dispensing and inventory"
  },
  laboratory: {
    hospitalId: "NGEMS-HOS-2026-000000",
    username: "laboratory",
    password: "demo123",
    role: "Laboratory Staff",
    description: "Test requests and results"
  },
  doctor: {
    hospitalId: "NGEMS-HOS-2026-000000",
    username: "doctor",
    password: "demo123",
    role: "Doctor",
    description: "Doctor dashboard access"
  },
  admin: {
    hospitalId: "NGEMS-HOS-2026-000000",
    username: "admin",
    password: "demo123",
    role: "Administrator",
    description: "System administration"
  }
};

export const validateDemoAccount = (
  hospitalId: string,
  username: string,
  password: string
): { valid: boolean; role?: string } => {
  const account = DEMO_ACCOUNTS[username as keyof typeof DEMO_ACCOUNTS];
  
  if (
    account &&
    account.hospitalId === hospitalId &&
    account.password === password
  ) {
    return { valid: true, role: account.role };
  }
  
  return { valid: false };
};
