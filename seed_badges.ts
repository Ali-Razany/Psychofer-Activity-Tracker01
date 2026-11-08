import { db } from './src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { BADGE_INFO } from './src/lib/badges';

async function seedBadges() {
  let count = 0;
  for (const [key, value] of Object.entries(BADGE_INFO)) {
    await setDoc(doc(db, 'badges', key), {
      id: key,
      label: value.label,
      desc: value.desc,
      icon: value.icon,
      bg: value.bg,
      color: value.color
    });
    count++;
  }
  console.log(`Successfully seeded ${count} badges.`);
  process.exit(0);
}
seedBadges().catch(console.error);
