import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC3qaSSI14q3Gl769U3-TbBqGhAeY0UXUQ",
  authDomain: "nee-bomma.firebaseapp.com",
  projectId: "nee-bomma",
  storageBucket: "nee-bomma.firebasestorage.app",
  messagingSenderId: "610998712779",
  appId: "1:610998712779:web:f60b9f9977a3d14acb9e4e",
  measurementId: "G-0GMLVB2WMN"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
