import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAAmWQPgQD1iePc2vltp62CfL7217R4bAE",
  authDomain: "prepwise-ebba9.firebaseapp.com",
  projectId: "prepwise-ebba9",
  storageBucket: "prepwise-ebba9.firebasestorage.app",
  messagingSenderId: "801538808002",
  appId: "1:801538808002:web:50f475e68e0ce795c7035b",
  measurementId: "G-NX00S60RLH",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
