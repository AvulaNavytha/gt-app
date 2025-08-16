import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import React from "react";

const firebaseConfigOne = {
  apiKey: "AIzaSyBUbbUFSH7P19jo3t9k3ZJHTJIpzaRoyq8",
  authDomain: "t1234-5baa6.firebaseapp.com",
  projectId: "t1234-5baa6",
  storageBucket: "t1234-5baa6.firebasestorage.app",
  messagingSenderId: "451956179520",
  appId: "1:451956179520:web:28cf759982c314692b55a5",
  measurementId: "G-VMHSW0QGMV"
};

const app = initializeApp(firebaseConfigOne);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
