#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin.apps[0];
  if (fs.existsSync(serviceAccountPath)) {
    const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    return admin.initializeApp({
      credential: admin.credential.cert(sa),
      projectId: sa.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  }

  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  throw new Error('No Firebase admin credentials found.');
}

async function seed() {
  initFirebase();
  const db = admin.firestore();

  const hospitalId = process.env.SEED_HOSPITAL_ID || 'NGEMS-HOS-2026-922107';
  const hospitalName = process.env.SEED_HOSPITAL_NAME || 'NGEMS Hospital';

  console.log('Seeding Firestore for', hospitalId);

  // Sample staff (doctor)
  const staffRef = db.collection('staff');
  const doctor = {
    hospitalId,
    hospitalName,
    role: 'Doctor',
    fullName: 'Dr. Samitha Perera',
    nic: '800123456V',
    dob: '1980-01-01',
    gender: 'Male',
    mobile: '+94771234567',
    username: 'dr.samitha',
    employeeId: 'DOC-0001',
    department: 'OPD',
    status: 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const staffDoc = await staffRef.add(doctor);
  console.log('Created staff:', staffDoc.id);

  // Sample patients
  const patientsRef = db.collection('patients');
  const patients = [
    {
      patientId: 'PAT-100001',
      hospitalId,
      hospitalName,
      name: 'Kamal Fernando',
      nic: '200208103755',
      mobile: '+94771234568',
      mobileSearch: '94771234568',
      dob: '2002-08-10',
      gender: 'Male',
      bloodGroup: 'A+',
      regDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      alerts: [],
      visits: [],
      medicines: [],
      labReports: [],
      hospitalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      patientId: 'PAT-100002',
      hospitalId,
      hospitalName,
      name: 'Nimal Perera',
      nic: '199505402128',
      mobile: '+94771234569',
      mobileSearch: '94771234569',
      dob: '1995-05-04',
      gender: 'Male',
      bloodGroup: 'B+',
      regDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      alerts: [],
      visits: [],
      medicines: [],
      labReports: [],
      hospitalHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const p of patients) {
    const doc = await patientsRef.add(p);
    console.log('Created patient:', doc.id, p.name);
  }

  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
