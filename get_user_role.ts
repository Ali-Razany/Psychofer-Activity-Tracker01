import { db } from './src/lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

async function run() {
  const snapshot = await getDocs(query(collection(db, 'users'), limit(5)));
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(data.roles, data.role);
  });
}
run().then(() => process.exit(0)).catch(console.error);
