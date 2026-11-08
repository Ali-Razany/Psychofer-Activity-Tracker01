import { db } from './src/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

async function run() {
  const users = await getDocs(collection(db, 'users'));
  for (const u of users.docs) {
    const data = u.data();
    if (data.roles.includes('Admin')) {
      console.log(`Admin ${u.id} - Points: ${data.points}`);
      // Zero out their points in the database just in case
      await updateDoc(doc(db, 'users', u.id), { points: 0, badges: [] });
    }
  }
}
run().then(() => process.exit(0));
