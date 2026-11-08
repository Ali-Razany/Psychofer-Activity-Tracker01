import { initializeApp, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  projectId: "gen-lang-client-0405210695"
});

const app = getApp();
const db = getFirestore(app, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

async function run() {
  try {
    const snap = await db.collection("users").limit(1).get();
    console.log("Success! Users found:", snap.size);
  } catch(e) {
    console.error(e);
  }
}
run();
