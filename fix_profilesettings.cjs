const fs = require('fs');

let psm = fs.readFileSync('src/components/ProfileSettingsModal.tsx', 'utf8');
psm = psm.replace(/telegramChatId: formData\.telegramChatId,/g, "");
fs.writeFileSync('src/components/ProfileSettingsModal.tsx', psm);

console.log('Fixed ProfileSettingsModal');
