import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

# 1. Remove Telegram logic
telegram_logic = """    // Send Telegram notification if user has telegramChatId
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
            message: `ئاگادارکردنەوەی نوێ لە سایکۆفێر:\\n${message}`
          })
        });
      } catch (err) {
        console.error("Failed to send telegram notification:", err);
      }
    }"""

content = content.replace(telegram_logic, "")

# 2. Ask for permission on init
permission_code = """useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);"""

# let's insert it inside AppProvider before return
provider_end = "return (\n    <AppContext.Provider"
content = content.replace(provider_end, permission_code + "\n  " + provider_end)

# 3. Handle onSnapshot to show Notification
old_notifs_snap = """unsubNotifs = onSnapshot(query(collection(db, 'notifications')), (snapshot) => {
          setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
        });"""

new_notifs_snap = """unsubNotifs = onSnapshot(query(collection(db, 'notifications')), (snapshot) => {
          setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const notif = change.doc.data() as Notification;
              if (notif.userId === user.uid && !notif.read) {
                const notifTime = new Date(notif.date).getTime();
                const now = Date.now();
                // Only show for very recent notifications (within last 30 seconds)
                if (now - notifTime < 30000) {
                  if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('سایکۆفێر (Psychosphere)', {
                      body: notif.message,
                      icon: '/psychosphere-logo.png', // or standard icon
                      dir: 'rtl'
                    });
                  }
                }
              }
            }
          });
        });"""

content = content.replace(old_notifs_snap, new_notifs_snap)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
