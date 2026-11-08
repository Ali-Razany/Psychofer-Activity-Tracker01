const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileSettingsModal.tsx', 'utf8');

code = code.replace(
  'socials: { telegram, facebook, instagram, telegramChatId: user.socials?.telegram === telegram ? user.socials?.telegramChatId : undefined }',
  'socials: { telegram, facebook, instagram, telegramChatId: user.socials?.telegram === telegram ? (user.socials?.telegramChatId || null) : null }'
);

fs.writeFileSync('src/components/ProfileSettingsModal.tsx', code);
