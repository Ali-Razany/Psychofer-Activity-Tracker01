import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: "AIzaSyCEyXZf5O6-EP8FngA2C3Mo4nuuyNLrhj0",
  authDomain: "gen-lang-client-0405210695.firebaseapp.com",
  projectId: "gen-lang-client-0405210695",
  storageBucket: "gen-lang-client-0405210695.firebasestorage.app",
  messagingSenderId: "627280206572",
  appId: "1:627280206572:web:a3bba1d668907b183ce3c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

let messaging: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}
export { messaging };
