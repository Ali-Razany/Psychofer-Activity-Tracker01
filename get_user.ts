import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function run() {
  const snapshot = await getDocs(collection(db, 'users'));
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.roles && data.roles.includes('Admin')) {
       console.log("ADMIN:", doc.id, data.name, data.departments);
    }
  });
}
run().then(() => process.exit(0)).catch(console.error);
