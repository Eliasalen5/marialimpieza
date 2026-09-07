import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function crearApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

let app: FirebaseApp | undefined;

function obtenerApp(): FirebaseApp {
  if (!app) app = crearApp();
  return app;
}

// auth, db y storage solo existen en el cliente.
// En el servidor (durante el prerender) no se inicializan para
// evitar errores de SDK en Node.
export const auth =
  typeof window !== "undefined" ? getAuth(obtenerApp()) : undefined;
export const db =
  typeof window !== "undefined" ? getFirestore(obtenerApp()) : undefined;
export const storage =
  typeof window !== "undefined" ? getStorage(obtenerApp()) : undefined;