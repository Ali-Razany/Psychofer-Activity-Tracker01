const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

const target = `    const unsubscribeAbout = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        setAboutInfo(docSnap.data());
      } else {`;

const replacement = `    const unsubscribeAbout = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.content && data.projectDesc) {
          setAboutInfo({ content: \`## \${data.projectTitle}\\n\\n\${data.projectDesc}\\n\\n## \${data.targetTitle}\\n\\n\${data.targetDesc}\` });
        } else if (!data.content) {
          setAboutInfo({ content: "سایکۆفێر (بە ئینگلیزی: Psychofer)... تکایە دەقەکە نوێ بکەرەوە." });
        } else {
          setAboutInfo(data);
        }
      } else {`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/store/AppContext.tsx', code);
  console.log('patched AppContext for backward compatibility');
} else {
  console.log('target not found');
}
