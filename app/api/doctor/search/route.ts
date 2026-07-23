import { NextResponse } from 'next/server';
import { patients, appointments } from '@/lib/data';

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.toLowerCase() || '';

  const patientMatches = patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.nic} ${patient.phone} ${patient.diagnosis} ${patient.blood} ${patient.allergies} ${patient.medication}`
      .toLowerCase()
      .includes(query)
  );

  const appointmentMatches = appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.patientId} ${appointment.reason} ${appointment.type} ${appointment.status}`
      .toLowerCase()
      .includes(query)
  );

  const enrichedPatientMatches = patientMatches.map((patient) => ({
    ...patient,
    type: 'Patient',
    status: patient.status,
    href: `/doctor/patients/${patient.id}`,
  }));

  const enrichedAppointmentMatches = appointmentMatches.map((appointment) => ({
    ...appointment,
    name: appointment.patient,
    id: appointment.patientId,
    type: appointment.type,
    status: appointment.status,
    href: `/doctor/appointments/${appointment.id}`,
  }));

  return NextResponse.json({ query, patientMatches: enrichedPatientMatches, appointmentMatches: enrichedAppointmentMatches });
}
