const fs = require('fs');

let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');
ctx = ctx.replace("deleteDoc, orderBy } from 'firebase/firestore';", "deleteDoc, orderBy, arrayUnion } from 'firebase/firestore';");
fs.writeFileSync('src/store/AppContext.tsx', ctx);

console.log('Fixed arrayUnion');
