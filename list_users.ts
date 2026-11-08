import { db } from './src/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function run() {
  const snapshot = await getDocs(collection(db, 'users'));
  snapshot.forEach(d => {
    console.log(d.id, d.data().email, d.data().name);
  });
}
run().then(() => process.exit(0)).catch(console.error);
