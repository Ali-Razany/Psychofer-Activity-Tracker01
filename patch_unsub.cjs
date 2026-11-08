const fs = require('fs');
let content = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

content = content.replace(/.*unsubInsta.*/g, "");

fs.writeFileSync('src/store/AppContext.tsx', content);
