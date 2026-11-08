import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf8');

const telegramEndpoint = `
  // Telegram notification endpoint
  app.post("/api/telegram/send", async (req, res) => {
    try {
      const { chatId, message } = req.body;
      const token = process.env.TELEGRAM_BOT_TOKEN;
      
      if (!token) {
        return res.status(400).json({ error: "Telegram bot token is not configured" });
      }
      
      if (!chatId) {
        return res.status(400).json({ error: "Chat ID is required" });
      }

      const response = await fetch(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.description || 'Failed to send telegram message');
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending telegram message:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development`;

code = code.replace(/  \/\/ Vite middleware for development/, telegramEndpoint);

fs.writeFileSync('server.ts', code);
