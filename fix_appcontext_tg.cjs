const fs = require('fs');

let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

// The line is: if (targetUser?.socials?.telegram) {
ctx = ctx.replace(/if \(targetUser\?\.socials\?\.telegram\) \{/g, "if (targetUser?.socials?.telegramChatId) {");

// The line is: body: JSON.stringify({ chatId: targetUser.socials?.telegram, message })
ctx = ctx.replace(/chatId: targetUser\.socials\?\.telegram,/g, "chatId: targetUser.socials?.telegramChatId,");

fs.writeFileSync('src/store/AppContext.tsx', ctx);
console.log('Fixed AppContext telegram logic');
