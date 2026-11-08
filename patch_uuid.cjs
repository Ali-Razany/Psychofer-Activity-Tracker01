const fs = require('fs');

let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

ctx = ctx.replace(/crypto\.randomUUID\(\)/g, "Date.now().toString(36) + Math.random().toString(36).substring(2)");

fs.writeFileSync('src/store/AppContext.tsx', ctx);
console.log('patched uuid');
