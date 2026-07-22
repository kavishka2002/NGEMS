const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account file not found:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: serviceAccount.project_id });
const db = admin.firestore();

async function seed() {
  const hospitalId = process.env.SEED_HOSPITAL_ID || 'NGEMS-HOS-2026-922107';
  console.log('Seeding pharmacy data for', hospitalId);

  // Create staff (pharmacist)
  const staffRef = await db.collection('staff').add({ hospitalId, name: 'Pharmacist Alice', role: 'pharmacist', createdAt: new Date().toISOString() });
  console.log('Created staff id', staffRef.id);

  // Create patients
  const patientA = { hospitalId, name: 'Kamal Fernando', nic: '971234567V', createdAt: new Date().toISOString() };
  const patientB = { hospitalId, name: 'Nimal Perera', nic: '951234567V', createdAt: new Date().toISOString() };
  const pARef = await db.collection('patients').add(patientA);
  const pBRef = await db.collection('patients').add(patientB);
  console.log('Created patients', pARef.id, pBRef.id);

  // Inventory items
  const items = [
    { name: 'Aspirin 500mg', quantity: 150, minQty: 50, unit: 'tablets', price: 5.5, expiryDate: '2027-06-15' },
    { name: 'Amoxicillin 250mg', quantity: 45, minQty: 50, unit: 'capsules', price: 12.0, expiryDate: '2027-08-20' },
    { name: 'Ibuprofen 200mg', quantity: 200, minQty: 100, unit: 'tablets', price: 8.0, expiryDate: '2026-12-30' },
    { name: 'Cough Syrup', quantity: 20, minQty: 30, unit: 'bottles', price: 15.0, expiryDate: '2026-10-15' },
  ];

  for (const it of items) {
    const doc = await db.collection('inventory').add({ hospitalId, ...it, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    console.log('Added inventory', doc.id, it.name);
  }

  // Create sample prescriptions
  const presc1 = {
    hospitalId,
    patientId: pARef.id,
    items: [ { name: 'Aspirin 500mg', qty: 30 }, { name: 'Amoxicillin 250mg', qty: 10 } ],
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const presc2 = {
    hospitalId,
    patientId: pBRef.id,
    items: [ { name: 'Ibuprofen 200mg', qty: 20 } ],
    status: 'Dispensed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const pr1 = await db.collection('prescriptions').add(presc1);
  const pr2 = await db.collection('prescriptions').add(presc2);
  console.log('Created prescriptions', pr1.id, pr2.id);

  // Create dispensing record for presc2
  const disp = await db.collection('dispensing').add({ hospitalId, prescriptionId: pr2.id, items: presc2.items, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), performedBy: staffRef.id });
  console.log('Created dispensing record', disp.id);

  console.log('Pharmacy seeding complete.');
}

seed().catch((err) => { console.error('Seeding failed', err); process.exit(1); });
