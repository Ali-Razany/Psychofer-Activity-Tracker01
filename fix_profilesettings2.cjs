const fs = require('fs');

let psm = fs.readFileSync('src/components/ProfileSettingsModal.tsx', 'utf8');
psm = psm.replace(/telegramChatId: tgDoc\.data\(\)\.chatId/g, "socials: { ...user.socials, telegram: tgDoc.data().chatId }");
fs.writeFileSync('src/components/ProfileSettingsModal.tsx', psm);

console.log('Fixed ProfileSettingsModal 2');
