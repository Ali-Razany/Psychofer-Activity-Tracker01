import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove the duplicated endpoint completely
content = re.sub(r'// Telegram notification endpoint.*?app\.post\("/api/telegram/notify", async \(req, res\) => \{.*?\}\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'      const userDoc = await db\.collection\("users"\)\.doc\(userId\)\.get\(\);.*?\}\);\n', '', content, flags=re.DOTALL)

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

# Insert the route before the Vite middleware setup
content = content.replace("// Vite middleware for development", notify_route.strip() + "\n\n  // Vite middleware for development")

with open('server.ts', 'w') as f:
    f.write(content)
