import { NextResponse } from 'next/server';
import { patients, appointments, medicalNotes, prescriptions, referrals, admissions, laboratoryTests, radiologyReports } from '@/lib/data';

export function GET(_request: Request, { params }: { params: { id: string } }) {
  const patient = patients.find((item) => item.id === params.id);

  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
  }

  const patientAppointments = appointments.filter((item) => item.patientId === patient.id);
  const patientNotes = medicalNotes.filter((item) => item.patientId === patient.id);
  const patientPrescriptions = prescriptions.filter((item) => item.patientId === patient.id);
  const patientReferrals = referrals.filter((item) => item.patientId === patient.id);
  const patientAdmissions = admissions.filter((item) => item.patientId === patient.id);
  const patientLab = laboratoryTests.filter((item) => item.patientId === patient.id);
  const patientRadiology = radiologyReports.filter((item) => item.patientId === patient.id);

  return NextResponse.json({
    patient,
    appointments: patientAppointments,
    notes: patientNotes,
    prescriptions: patientPrescriptions,
    referrals: patientReferrals,
    admissions: patientAdmissions,
    laboratory: patientLab,
    radiology: patientRadiology,
  });
}
