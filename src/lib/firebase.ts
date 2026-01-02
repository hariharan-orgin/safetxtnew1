// Firebase initialization for SafeText
// Uses Firebase Auth for authentication and Firestore for roles/incidents.

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyARRYmzqgSWofzG8uM6mEt-L1eqnKoCWBc',
  authDomain: 'safe-text-v2.firebaseapp.com',
  projectId: 'safe-text-v2',
  storageBucket: 'safe-text-v2.firebasestorage.app',
  messagingSenderId: '351043663742',
  appId: '1:351043663742:web:e1353e8c7df9f4871b652f',
  measurementId: 'G-CGC0FCSF0F',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const firebaseAuth = getAuth(app);
export const firebaseDb = getFirestore(app);
