const fs = require('fs');

let psm = fs.readFileSync('src/components/ProfileSettingsModal.tsx', 'utf8');

// Replace the verification handler
psm = psm.replace(/await updateProfile\(user\.id, \{ socials: \{ \.\.\.user\.socials, telegram: tgDoc\.data\(\)\.chatId \} \}\);/g, "await updateProfile(user.id, { socials: { ...user.socials, telegramChatId: tgDoc.data().chatId, telegram } });");

// And update the save handler
// currently it has: socials: { telegram, facebook, instagram }
// we want to preserve telegramChatId if we're not clearing telegram, or clear it if they changed telegram?
// Best is to do: socials: { telegram, facebook, instagram, telegramChatId: user.socials?.telegram === telegram ? user.socials?.telegramChatId : undefined }
psm = psm.replace(/socials: \{ telegram, facebook, instagram \}/g, "socials: { telegram, facebook, instagram, telegramChatId: user.socials?.telegram === telegram ? user.socials?.telegramChatId : undefined }");

fs.writeFileSync('src/components/ProfileSettingsModal.tsx', psm);
console.log('Fixed ProfileSettingsModal');
