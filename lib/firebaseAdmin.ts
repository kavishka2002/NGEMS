import { existsSync, readFileSync } from "fs";
import * as path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  path.join(process.cwd(), "ngems-62de5-firebase-adminsdk-fbsvc-338326775c.json");

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
    });
  }

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }

  throw new Error(
    "Firebase Admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or the required Firebase admin env vars."
  );
}

export function getFirestoreClient() {
  initFirebaseAdmin();
  return getFirestore();
}
