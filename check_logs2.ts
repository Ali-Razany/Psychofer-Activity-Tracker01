import { db } from './src/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function run() {
  const users = await getDocs(collection(db, 'users'));
  let adminIds = [];
  users.forEach(u => {
    if (u.data().roles && u.data().roles.includes('Admin')) {
      adminIds.push(u.id);
    }
  });
  
  const logs = await getDocs(collection(db, 'activity_logs'));
  let remaining = 0;
  for (const l of logs.docs) {
    if (adminIds.includes(l.data().userId)) {
      remaining++;
    }
  }
  console.log("Remaining logs for admins:", remaining);
}
run().then(() => process.exit(0)).catch(console.error);
