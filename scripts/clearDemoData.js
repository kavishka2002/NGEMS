#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json');
if (!fs.existsSync(serviceAccountPath)) throw new Error(`Service account file not found: ${serviceAccountPath}`);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: serviceAccount.project_id });

async function clearDemoData() {
  const hospitalId = process.env.CLEAR_HOSPITAL_ID || 'NGEMS-HOS-2026-922107';
  const db = admin.firestore();
  const collections = ['inventory', 'dispensing', 'pharmacyTransactions', 'prescriptions', 'patients', 'staff'];
  for (const collection of collections) {
    const snapshot = await db.collection(collection).where('hospitalId', '==', hospitalId).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    if (!snapshot.empty) await batch.commit();
    console.log(`Deleted ${snapshot.size} ${collection} record(s)`);
  }
}

clearDemoData().catch(error => { console.error(error); process.exitCode = 1; });