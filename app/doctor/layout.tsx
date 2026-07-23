import DoctorShell from '@/components/doctor/Doctorshell';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <DoctorShell>{children}</DoctorShell>;
}
