import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';

admin.initializeApp({
  projectId: "gen-lang-client-0405210695"
});

const auth = getAuth();

async function run() {
  try {
    const u = await auth.getUserByEmail('MUHAMMED.ABDULQADR6@gmail.com');
    console.log("User:", u.uid);
  } catch(e) {
    console.error(e);
  }
}
run().then(() => process.exit(0));
