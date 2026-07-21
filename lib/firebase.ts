import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBNDaJ3qpJbsseBdHMI4O1iR721mdnQLT4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ngems-9815e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ngems-9815e",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ngems-9815e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "524761733968",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:524761733968:web:30a4c6285e40bfb618ea55",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HWF70WL70E",
};

const initializeFirebase = (): FirebaseApp => {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
};

const firebaseApp = initializeFirebase();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

let firebaseAnalytics: Analytics | null = null;

if (typeof window !== "undefined") {
  void isSupported().then((supported) => {
    if (supported) {
      firebaseAnalytics = getAnalytics(firebaseApp);
    }
  });
}

export { firebaseApp, firebaseAnalytics, auth, db, storage };
export default firebaseApp;
