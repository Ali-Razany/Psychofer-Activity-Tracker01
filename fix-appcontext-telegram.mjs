import fs from 'fs';
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

const oldFunc = `const addNotification = async (userId: string, message: string, type: string) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    });
  };`;

const newFunc = `const addNotification = async (userId: string, message: string, type: string) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    });
    
    // Send Telegram notification if user has telegramChatId
    const targetUser = rawUsers.find(u => u.id === userId);
    if (targetUser?.telegramChatId) {
      try {
        await fetch('/api/telegram/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: targetUser.telegramChatId,
            message: \`ئاگادارکردنەوەی نوێ لە سایکۆفێر:\\n\${message}\`
          })
        });
      } catch (err) {
        console.error("Failed to send telegram notification:", err);
      }
    }
  };`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/store/AppContext.tsx', code);
