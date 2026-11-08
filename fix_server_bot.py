import re

with open('server.ts', 'r') as f:
    content = f.read()

bot_setup = """
import TelegramBot from 'node-telegram-bot-api';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCEyXZf5O6-EP8FngA2C3Mo4nuuyNLrhj0",
  authDomain: "gen-lang-client-0405210695.firebaseapp.com",
  projectId: "gen-lang-client-0405210695",
  storageBucket: "gen-lang-client-0405210695.firebasestorage.app",
  messagingSenderId: "627280206572",
  appId: "1:627280206572:web:a3bba1d668907b183ce3c9"
};
const clientApp = initializeApp(firebaseConfig, "client-app");
const clientDb = getFirestore(clientApp, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

const token = process.env.MY_TELEGRAM_BOT_TOKEN?.trim();
let bot: TelegramBot | null = null;
if (token) {
  bot = new TelegramBot(token, { polling: true });
  
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    let username = msg.from?.username;
    
    if (username) {
      try {
        // Strip @ if present
        username = username.replace('@', '');
        await setDoc(doc(clientDb, 'telegram_links', username.toLowerCase()), {
          chatId: chatId.toString(),
          timestamp: Date.now()
        });
        bot?.sendMessage(chatId, `بەخێربێیت! ئەگەر یوزەرنەیمەکەت لە ئەپەکە نووسیبێت، ئێستا دەتوانیت دوگمەی 'پشتڕاستکردنەوە' دابگریت.`);
      } catch (err) {
        console.error('Error linking telegram:', err);
      }
    } else {
      bot?.sendMessage(chatId, 'تکایە یوزەرنەیمی تێلیگرام بۆ هەژمارەکەت دابنێ پێش ئەوەی بەکاری بهێنیت.');
    }
  });
}
"""

content = re.sub(r"import TelegramBot from 'node-telegram-bot-api';.*?}\n  \};\n}", bot_setup.strip(), content, flags=re.DOTALL)

notify_route = """
  // Telegram notification endpoint
  app.post("/api/telegram/notify", async (req, res) => {
    try {
      const { chatId, message } = req.body;
      if (!chatId || !message) return res.status(400).json({ error: "Missing parameters" });
      
      if (bot) {
        await bot.sendMessage(chatId, message);
        return res.json({ success: true, sent: true });
      }
      return res.json({ success: true, sent: false, reason: "No bot token" });
    } catch (error: any) {
      console.error("Error sending telegram notification:", error);
      res.status(500).json({ error: error.message });
    }
  });
"""

content = re.sub(r"// Telegram notification endpoint.*?app\.post\(\"/api/telegram/notify\".*?\}\);\n", notify_route.strip() + "\n", content, flags=re.DOTALL)

with open('server.ts', 'w') as f:
    f.write(content)
