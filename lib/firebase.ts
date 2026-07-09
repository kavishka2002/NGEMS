import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBNDaJ3qpJbsseBdHMI4O1iR721mdnQLT4",
  authDomain: "ngems-9815e.firebaseapp.com",
  projectId: "ngems-9815e",
  storageBucket: "ngems-9815e.firebasestorage.app",
  messagingSenderId: "524761733968",
  appId: "1:524761733968:web:30a4c6285e40bfb618ea55",
  measurementId: "G-HWF70WL70E",
};

let firebaseApp: FirebaseApp;
let firebaseAnalytics: Analytics | null = null;

if (typeof window !== "undefined") {
  firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

  void isSupported().then((supported) => {
    if (supported) {
      firebaseAnalytics = getAnalytics(firebaseApp);
    }
  });
} else {
  firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
}

export { firebaseApp, firebaseAnalytics };
