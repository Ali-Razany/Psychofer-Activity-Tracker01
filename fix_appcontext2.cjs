const fs = require('fs');

let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

const target = `    const updateAboutInfo = async (info: any) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), info);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };`;

// Remove it from inside useEffect
code = code.replace(target, "");

// Add it outside useEffect, just before login
const methodsTarget = `  const login = async (e: string, p: string) => {`;
const methodsRepl = `  const updateAboutInfo = async (info: any) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), info);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const login = async (e: string, p: string) => {`;

code = code.replace(methodsTarget, methodsRepl);

fs.writeFileSync('src/store/AppContext.tsx', code);
console.log('Fixed AppContext updateAboutInfo scope');
