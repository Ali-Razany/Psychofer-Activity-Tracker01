import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

handler = """
                    const perm = await window.Notification.requestPermission();
                    if (perm === 'granted' && messaging) {
                      // Register the service worker manually with a cache-busting query parameter
                      const swUrl = '/firebase-messaging-sw.js?v=' + Date.now();
                      const registration = await navigator.serviceWorker.register(swUrl);
                      
                      const token = await getToken(messaging, { 
                        serviceWorkerRegistration: registration,
                        vapidKey: 'BKc_x2-O4ZqHn9D4P6o2f2wG62xKxX-W3W3U_6W8X_4_J5Z7z8W9b4Y1C9Z2W6H3-Z5W2U1C2Z5Z7_9Z3Y1X3Z5' 
                      });
                      
                      if (token) {
                        await updateProfile(user.id, { fcmToken: token });
                        new window.Notification('سایکۆفێر', { body: 'ئاگادارکردنەوەکان چالاک کران!', dir: 'rtl' });
                        alert('بە سەرکەوتوویی چالاک کرا');
                      }
                    } else {
                      alert('ڕێگەپێدان ڕەتکرایەوە یان پشتگیری ناکرێت.');
                    }
"""

content = re.sub(
    r'const perm = await window\.Notification\.requestPermission\(\);\s*if \(perm === \'granted\' && messaging\) \{[\s\S]*?\} else \{\s*alert\(\'ڕێگەپێدان ڕەتکرایەوە یان پشتگیری ناکرێت\.\'\);\s*\}',
    handler.strip(),
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)

