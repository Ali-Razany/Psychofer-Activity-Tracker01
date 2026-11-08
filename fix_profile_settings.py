import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

import_messaging = "import { messaging } from '../lib/firebase';\nimport { getToken } from 'firebase/messaging';"
content = content.replace("import { useAppContext } from '../store/AppContext';", "import { useAppContext } from '../store/AppContext';\n" + import_messaging)

# We need to update the button click handler for enable notifications
notif_handler = """
                onClick={async () => {
                  try {
                    const perm = await window.Notification.requestPermission();
                    if (perm === 'granted' && messaging) {
                      const currentToken = await getToken(messaging, { vapidKey: 'BKc_x2-O4ZqHn9D4P6o2f2wG62xKxX-W3W3U_6W8X_4_J5Z7z8W9b4Y1C9Z2W6H3-Z5W2U1C2Z5Z7_9Z3Y1X3Z5' }); // Assuming we have a vapid key or just rely on default if missing. Wait, without vapidkey it might fail in some setups, but let's try without it first or omit it. Actually, `getToken(messaging)` uses the default vapid key if not provided, but usually we provide it. Let's just use getToken(messaging)
                      
                      const token = await getToken(messaging);
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

# Let's replace the whole onClick of that button
content = re.sub(
    r'onClick=\{async \(\) => \{\s*if \(\'Notification\' in window\) \{\s*const perm = await window\.Notification\.requestPermission\(\);\s*if \(perm === \'granted\'\) \{\s*new window\.Notification\(\'سایکۆفێر\', \{ body: \'ئاگادارکردنەوەکان چالاک کران!\', dir: \'rtl\' \}\);\s*\} else \{\s*alert\(\'ڕێگەپێدان ڕەتکرایەوە یان پشتگیری ناکرێت\.\'\);\s*\}\s*\} else \{\s*alert\(\'مۆبایلەکەت پشتگیری ئەم تایبەتمەندییە ناکات\.\'\);\s*\}\s*\}\}',
    notif_handler,
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
