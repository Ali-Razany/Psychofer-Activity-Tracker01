import { db } from './src/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';

const newActivities = [
  // نەخشەسازی
  { department: "نەخشەسازی", name: "دیزاینی کەڤەری ڤیدیۆ", basePoints: 5 },
  { department: "نەخشەسازی", name: "دیزاینی ڕیکلام", basePoints: 5 },
  { department: "نەخشەسازی", name: "مۆنتاژی ڤیدیۆی سەروو ٢ دەقەیی", basePoints: 7 },
  { department: "نەخشەسازی", name: "مۆنتاژی کەمتر لە ٢ دەقە", basePoints: 5 },
  { department: "نەخشەسازی", name: "سەرپەرشتیاری دەستە", basePoints: 4 },
  { department: "نەخشەسازی", name: "ئەرکی تر", basePoints: 3 },

  // ڕاگەیاندن
  { department: "ڕاگەیاندن", name: "پۆستکردن لە فەیسبووک", basePoints: 2 },
  { department: "ڕاگەیاندن", name: "پۆستکردن لە ئینستگرام", basePoints: 2 },
  { department: "ڕاگەیاندن", name: "پۆستکردن لە تێلیگرام", basePoints: 2 },
  { department: "ڕاگەیاندن", name: "پۆستکردن لە یوتیوب", basePoints: 2 },
  { department: "ڕاگەیاندن", name: "وەڵامدانەوەی کۆمێنت و نامەکان", basePoints: 1 },
  { department: "ڕاگەیاندن", name: "ڕێکخستنەوەی هایلایت و ڕووکاری پەڕەکان", basePoints: 2 },
  { department: "ڕاگەیاندن", name: "سەرپەرشتیاری دەستە", basePoints: 4 },
  { department: "ڕاگەیاندن", name: "ئەرکی تر", basePoints: 2 },

  // وەرگێڕان
  { department: "وەرگێڕان", name: "وەرگێڕانی ڤیدیۆی سەروو ٢ دەقەیی", basePoints: 7 },
  { department: "وەرگێڕان", name: "وەرگێڕانی ڤیدیۆی خوار 2 دەقەیی", basePoints: 5 },
  { department: "وەرگێڕان", name: "پێداچوونەوەی وەرگێرانی سەروو 2 دەقەیی", basePoints: 6 },
  { department: "وەرگێڕان", name: "پێداچوونەوەی وەرگێڕانی خوار 2 دەقەیی", basePoints: 4 },
  { department: "وەرگێڕان", name: "سەرپەرشتیاری دەستەی وەرگێران", basePoints: 5 },
  { department: "وەرگێڕان", name: "ئەرکی تر", basePoints: 4 },

  // خول
  { department: "خول", name: "پێشکەشکاری", basePoints: 4 },
  { department: "خول", name: "بەڕێوەبردنی خول", basePoints: 5 },
  { department: "خول", name: "سەرپەرشتیاری دەستە", basePoints: 3 },

  // وێبینار
  { department: "وێبینار", name: "پێشکەشکاری", basePoints: 4 },
  { department: "وێبینار", name: "بەڕێوەبردنی وێبینار", basePoints: 5 },
  { department: "وێبینار", name: "سەرپەرشتیاری دەستە", basePoints: 3 },

  // سمینار
  { department: "سمینار", name: "پێشکەشکاری", basePoints: 5 },
  { department: "سمینار", name: "بەڕێوەبردنی سمینار", basePoints: 5 },
  { department: "سمینار", name: "سەرپەرشتیاری دەستە", basePoints: 3 },

  // تایپ
  { department: "تایپ", name: "دانانی کاتبەندی", basePoints: 5 },
  { department: "تایپ", name: "تایپکردنەوە سەروو 300 وشە", basePoints: 7 },
  { department: "تایپ", name: "تایپکردنەوە خوار 300 وشە", basePoints: 5 },
];

async function run() {
  console.log("Fetching departments...");
  const depsSnapshot = await getDocs(collection(db, 'departments'));
  const depsMap = new Map();
  depsSnapshot.forEach(doc => {
    depsMap.set(doc.data().name.trim(), doc.data().id);
  });
  console.log("Departments found:", Array.from(depsMap.keys()));

  console.log("Deleting old activities...");
  const actsSnapshot = await getDocs(collection(db, 'activities'));
  for (const docSnap of actsSnapshot.docs) {
    await deleteDoc(doc(db, 'activities', docSnap.id));
  }

  console.log("Adding new activities...");
  let count = 0;
  for (const act of newActivities) {
    let deptId = depsMap.get(act.department);
    if (!deptId) {
      console.warn(`Warning: Department '${act.department}' not found in DB.`);
      deptId = act.department;
    }
    
    const id = Date.now().toString() + Math.floor(Math.random() * 1000000).toString();
    await setDoc(doc(db, 'activities', id), {
      id,
      department: deptId,
      name: act.name,
      basePoints: act.basePoints
    });
    count++;
    await new Promise(r => setTimeout(r, 10));
  }
  
  console.log(`Successfully added ${count} activities.`);
  process.exit(0);
}

run().catch(console.error);
