import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEyXZf5O6-EP8FngA2C3Mo4nuuyNLrhj0",
  authDomain: "gen-lang-client-0405210695.firebaseapp.com",
  projectId: "gen-lang-client-0405210695",
  storageBucket: "gen-lang-client-0405210695.firebasestorage.app",
  messagingSenderId: "627280206572",
  appId: "1:627280206572:web:a3bba1d668907b183ce3c9"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

async function run() {
  try {
    const q = query(collection(db, 'users'), limit(1));
    const snap = await getDocs(q);
    console.log("Success! Users found:", snap.size);
  } catch(e) {
    console.error(e);
  }
}
run();
