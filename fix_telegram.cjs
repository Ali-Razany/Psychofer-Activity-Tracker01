const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  'bot = new TelegramBot(token, { polling: true });',
  `bot = new TelegramBot(token, { polling: { params: { timeout: 10 } } });

    process.once('SIGINT', () => bot?.stopPolling());
    process.once('SIGTERM', () => bot?.stopPolling());`
);

fs.writeFileSync('server.ts', content);
