const fs = require('fs');
let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');
ctx = `import { arrayUnion } from 'firebase/firestore';\n` + ctx;
fs.writeFileSync('src/store/AppContext.tsx', ctx);
