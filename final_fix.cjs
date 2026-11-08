const fs = require('fs');

// Fix arrayUnion in AppContext
let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');
ctx = ctx.replace(/orderBy \} from 'firebase\/firestore';/, "orderBy, arrayUnion } from 'firebase/firestore';");

// Fix telegramChatId in AppContext
ctx = ctx.replace(/telegramChatId: t,/g, "");
ctx = ctx.replace(/telegramChatId: user\.telegramChatId,/g, "");
fs.writeFileSync('src/store/AppContext.tsx', ctx);

// Fix ActivityTask in Dashboard
let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(/a\.departments\?\./g, "a.department");
// also fix type
dash = dash.replace(/a\.type/g, "''"); // if there's an a.type around line 381
fs.writeFileSync('src/components/Dashboard.tsx', dash);

console.log('Fixed everything I hope');
