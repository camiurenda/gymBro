import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClfNyySdbKDVFPeKgYmT4R1qUoR6VAmdQ",
  authDomain: "gymbro-e5b16.firebaseapp.com",
  projectId: "gymbro-e5b16",
  storageBucket: "gymbro-e5b16.firebasestorage.app",
  messagingSenderId: "792521511745",
  appId: "1:792521511745:web:111fb842e21434e49047c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); // El servicio de autenticación
export const db = getFirestore(app); // El servicio de la base de datos (Firestore)