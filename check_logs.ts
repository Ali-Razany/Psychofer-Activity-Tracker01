import { db } from './src/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

async function run() {
  const users = await getDocs(collection(db, 'users'));
  let adminIds = [];
  users.forEach(u => {
    const data = u.data();
    if (data.roles && data.roles.includes('Admin')) {
      adminIds.push(u.id);
    }
  });
  
  console.log("Admin IDs:", adminIds);
  const logs = await getDocs(collection(db, 'activity_logs'));
  let count = 0;
  for (const l of logs.docs) {
    if (adminIds.includes(l.data().userId)) {
      await deleteDoc(doc(db, 'activity_logs', l.id));
      count++;
    }
  }
  console.log("Deleted admin logs:", count);
  
  for (const id of adminIds) {
    await updateDoc(doc(db, 'users', id), { points: 0, badges: [] });
  }
  console.log("Zeroed out points and badges for admins.");
}
run().then(() => process.exit(0)).catch(console.error);
