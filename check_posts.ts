import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { firebaseConfig } from './src/lib/firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

async function main() {
  const postsRef = collection(db, 'instagram_posts');
  const snapshot = await getDocs(postsRef);
  console.log(`Found ${snapshot.size} posts in database.`);
  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data().permalink);
  });
  process.exit(0);
}
main();
