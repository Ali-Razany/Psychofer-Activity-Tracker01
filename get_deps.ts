import { db } from './src/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

async function run() {
  const deps = await getDocs(collection(db, 'departments'));
  deps.forEach(d => console.log("DEP:", d.id, d.data().name));

  const adminId = 'sYmOjtxJy4OnEyf0uhP1FvdR6mg2';
  await updateDoc(doc(db, 'users', adminId), { departments: [] });
  console.log("Admin departments cleared.");
}
run().then(() => process.exit(0)).catch(console.error);
