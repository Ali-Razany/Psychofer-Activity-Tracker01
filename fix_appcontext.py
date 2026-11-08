import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

new_add_notification = """
  const addNotification = async (userId: string, message: string, type: string) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    });
    
    try {
      // Find the user to get their telegramChatId
      const targetUser = users.find(u => u.id === userId);
      if (targetUser?.telegramChatId) {
        await fetch('/api/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: targetUser.telegramChatId, message })
        });
      }
    } catch (err) {
      console.error('Failed to send telegram notification:', err);
    }
  };
"""

content = re.sub(r'const addNotification = async \(userId: string, message: string, type: string\) => \{.*?\n  \};', new_add_notification.strip(), content, flags=re.DOTALL)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
