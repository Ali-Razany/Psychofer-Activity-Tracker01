import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

admin.initializeApp({
  projectId: "gen-lang-client-0405210695"
});

const db = getFirestore(undefined, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

async function run() {
  try {
    const s = await db.collection("users").limit(1).get();
    console.log("Docs:", s.docs.length);
  } catch(e) {
    console.error(e);
  }
}
run().then(() => process.exit(0));
