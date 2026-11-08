const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldStr = `      if (error.code === 'ETELEGRAM' && (error.message.includes('404') || error.message.includes('401') || error.message.includes('409'))) {
        console.warn('Invalid Telegram token or conflict, stopping polling.');
        bot.stopPolling();
      }`;

const newStr = `      if (error.code === 'ETELEGRAM' && (error.message.includes('404') || error.message.includes('401') || error.message.includes('409'))) {
        if (!error.message.includes('409')) {
          console.warn('Invalid Telegram token, stopping polling.');
        }
        bot.stopPolling();
      }`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('server.ts', code);
