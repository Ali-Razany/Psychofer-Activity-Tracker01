import { db } from './src/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

async function run() {
  const uid = 'sYmOjtxJy4OnEyf0uhP1FvdR6mg2';
  await updateDoc(doc(db, 'users', uid), { 
    roles: ['Admin'] 
  });
  console.log("Role updated successfully for uid:", uid);
}
run().then(() => process.exit(0)).catch(console.error);
