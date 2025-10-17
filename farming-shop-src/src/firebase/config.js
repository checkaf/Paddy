import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Replace with your Firebase web app config when available
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE || 'demo.appspot.com',
    messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || '000000000000',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


