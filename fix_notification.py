import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

handler = """
                      if (token) {
                        await updateProfile(user.id, { fcmToken: token });
                        try {
                          await registration.showNotification('سایکۆفێر', { body: 'ئاگادارکردنەوەکان چالاک کران!', dir: 'rtl', icon: '/vite.svg' });
                        } catch (e) {
                          console.log('Mobile notification fallback:', e);
                        }
                        alert('بە سەرکەوتوویی چالاک کرا');
                      }
"""

content = re.sub(
    r'if \(token\) \{\s*await updateProfile\(user\.id, \{ fcmToken: token \}\);\s*new window\.Notification\(\'سایکۆفێر\', \{ body: \'ئاگادارکردنەوەکان چالاک کران!\', dir: \'rtl\' \}\);\s*alert\(\'بە سەرکەوتوویی چالاک کرا\'\);\s*\}',
    handler.strip(),
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)

