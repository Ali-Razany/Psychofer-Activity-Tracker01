import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

notif_handler = """
                onClick={async () => {
                  if (window.self !== window.top) {
                    alert('تکایە بەرنامەکە لە تابی نوێدا (New Tab) بکەرەوە بۆ چالاککردنی ئاگادارکردنەوەکان، چونکە لەناو ئەم چوارچێوەیەدا (iFrame) ڕێگەپێدراو نییە.');
                    return;
                  }
                  try {
                    const perm = await window.Notification.requestPermission();
                    if (perm === 'granted' && messaging) {
                      const token = await getToken(messaging, { vapidKey: 'BKc_x2-O4ZqHn9D4P6o2f2wG62xKxX-W3W3U_6W8X_4_J5Z7z8W9b4Y1C9Z2W6H3-Z5W2U1C2Z5Z7_9Z3Y1X3Z5' });
                      if (token) {
                        await updateProfile(user.id, { fcmToken: token });
                        new window.Notification('سایکۆفێر', { body: 'ئاگادارکردنەوەکان چالاک کران!', dir: 'rtl' });
                        alert('بە سەرکەوتوویی چالاک کرا');
                      }
                    } else {
                      alert('ڕێگەپێدان ڕەتکرایەوە یان پشتگیری ناکرێت.');
                    }
                  } catch(e) {
                    console.error(e);
                    alert('هەڵەیەک ڕوویدا لە کاتی چالاککردن: ' + String(e));
                  }
                }}
"""

content = re.sub(
    r'onClick=\{async \(\) => \{[\s\S]*?\} catch\(e\) \{[\s\S]*?\}\s*\}\}',
    notif_handler.strip(),
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)

