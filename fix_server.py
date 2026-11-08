import re

with open('server.ts', 'r') as f:
    content = f.read()

bot_setup = """
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
let bot: TelegramBot | null = null;
if (token) {
  bot = new TelegramBot(token, { polling: true });
  
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from?.username;
    
    if (username) {
      try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('socials.telegram', '==', username).get();
        
        if (snapshot.empty) {
          bot?.sendMessage(chatId, `ببورە، هیچ هەژمارێک نەدۆزرایەوە بە یوزەرنەیمی @${username} لە سیستەمەکەدا. تکایە سەرەتا یوزەرنەیمەکەت لە ڕێکخستنەکانی پڕۆفایل بنووسە پاشان دووبارە /start بکە.`);
        } else {
          let updated = false;
          snapshot.forEach(doc => {
            doc.ref.update({ telegramChatId: chatId.toString() });
            updated = true;
          });
          if (updated) {
            bot?.sendMessage(chatId, `بەخێربێیت! هەژمارەکەت سەرکەوتووانە بەسترایەوە بە بۆتەکەوە. لەمەودوا ئاگادارکردنەوەکانت لێرە پێدەگات.`);
          }
        }
      } catch (err) {
        console.error('Error linking telegram:', err);
      }
    } else {
      bot?.sendMessage(chatId, 'تکایە یوزەرنەیمی تێلیگرام بۆ هەژمارەکەت دابنێ پێش ئەوەی بەکاری بهێنیت.');
    }
  });
}

"""

notify_route = """
  // Telegram notification endpoint
  app.post("/api/telegram/notify", async (req, res) => {
    try {
      const { userId, message } = req.body;
      if (!userId || !message) return res.status(400).json({ error: "Missing parameters" });
      
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
      
      const chatId = userDoc.data()?.telegramChatId;
      if (chatId && bot) {
        await bot.sendMessage(chatId, message);
        return res.json({ success: true, sent: true });
      }
      return res.json({ success: true, sent: false, reason: "No chat ID" });
    } catch (error: any) {
      console.error("Error sending telegram notification:", error);
      res.status(500).json({ error: error.message });
    }
  });
"""

# add import and bot setup after const auth = getAuth();
content = content.replace("const auth = getAuth();", "const auth = getAuth();\n" + bot_setup)

# add route
content = content.replace("// Telegram notification endpoint", notify_route)

with open('server.ts', 'w') as f:
    f.write(content)
