/**
 * ============================================================================
 * ZEN TACH - FIREBASE CONFIGURATION
 * ============================================================================
 * Paste your Firebase Web API keys and project credentials below.
 * You can get these credentials from:
 * Firebase Console -> Project Settings -> General -> Your apps -> Web app (</>)
 *
 * NOTE: You can either paste your keys directly into this file,
 * OR set them in a .env file using VITE_FIREBASE_* variables.
 * ============================================================================
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  // PASTE YOUR FIREBASE API KEY HERE:
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDLBKEWIekiXciLqIVSmgY2xmVZM27-yxY",

  // PASTE YOUR AUTH DOMAIN HERE (e.g., yourproject.firebaseapp.com):
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "zentach.firebaseapp.com",

  // PASTE YOUR FIREBASE PROJECT ID HERE:
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "zentach",

  // PASTE YOUR STORAGE BUCKET HERE (e.g., yourproject.firebasestorage.app):
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "zentach.firebasestorage.app",

  // PASTE YOUR MESSAGING SENDER ID HERE:
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "382426464919",

  // PASTE YOUR FIREBASE APP ID HERE:
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:382426464919:web:c85e6418b5d5a8c8785fd2",

  // OPTIONAL: Measurement ID for Google Analytics (e.g., G-XXXXXXX):
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

/**
 * Super Administrator credentials for ZEN TACH E-Commerce
 */
export const ADMIN_INITIAL_UID = import.meta.env.VITE_ADMIN_UID || "TubyJ10MBxRu4n34WlbaC34Jw1J3";
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "prorabbiv@gmail.com";

export default firebaseConfig;
