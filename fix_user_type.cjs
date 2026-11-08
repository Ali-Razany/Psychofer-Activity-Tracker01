const fs = require('fs');

let ctx = fs.readFileSync('src/types.ts', 'utf8');
ctx = ctx.replace(/telegram\?: string;/g, "telegram?: string;\n    telegramChatId?: string;");
fs.writeFileSync('src/types.ts', ctx);

console.log('Fixed User Type');
