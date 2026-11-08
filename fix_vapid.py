import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

handler = """
                  if (window.self !== window.top) {
                    alert('تکایە بەرنامەکە لە تابی نوێدا (New Tab) بکەرەوە بۆ چالاککردنی ئاگادارکردنەوەکان، چونکە لەناو ئەم چوارچێوەیەدا (iFrame) ڕێگەپێدراو نییە.');
                    return;
                  }
                  
                  const vapidKey = import.meta.env.VITE_VAPID_KEY;
                  if (!vapidKey) {
                    alert('بۆ کارکردنی ئەم تایبەتمەندییە، پێویستە کلیلی VAPID لە بەشی ڕێکخستنەکانی ژینگە (Secrets / Environment Variables) بە ناوی VITE_VAPID_KEY زیاد بکەیت. دەتوانیت لە فایەربەیس دەستی بخەیت: Project Settings > Cloud Messaging > Web configuration.');
                    return;
                  }

                  try {
                    const perm = await window.Notification.requestPermission();
                    if (perm === 'granted' && messaging) {
                      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                      await navigator.serviceWorker.ready;
                      
                      const token = await getToken(messaging, { 
                        serviceWorkerRegistration: registration,
                        vapidKey: vapidKey 
                      });
                      
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
"""

content = re.sub(
    r'if \(window\.self !== window\.top\) \{[\s\S]*?\} catch\(e\) \{[\s\S]*?\}',
    handler.strip(),
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)

