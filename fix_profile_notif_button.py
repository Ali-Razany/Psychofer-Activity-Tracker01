import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

notif_button = """            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئاگادارکردنەوەی مۆبایل / وێب</label>
              <button
                type="button"
                onClick={async () => {
                  if ('Notification' in window) {
                    const perm = await Notification.requestPermission();
                    if (perm === 'granted') {
                      new Notification('سایکۆفێر', { body: 'ئاگادارکردنەوەکان چالاک کران!', dir: 'rtl' });
                    } else {
                      alert('ڕێگەپێدان ڕەتکرایەوە یان پشتگیری ناکرێت.');
                    }
                  } else {
                    alert('مۆبایلەکەت پشتگیری ئەم تایبەتمەندییە ناکات.');
                  }
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-[20px] px-4 py-2.5 font-medium transition-colors text-right flex items-center justify-between"
              >
                <span>چالاککردنی ئاگادارکردنەوەکان</span>
                <Icon icon="hugeicons:notification-03" width={20} />
              </button>
              <p className="text-xs text-neutral-500 mt-2">ئەمە ڕێگە دەدات ئاگادارکردنەوەکان ڕاستەوخۆ بێنە سەر شاشەی مۆبایلەکەت.</p>
            </div>"""

content = content.replace(
    "<div>\n              <label className=\"block text-sm font-medium text-slate-700 mb-1.5\">کورتییەک دەربارەی خۆت (بایۆ)</label>",
    notif_button + "\n            <div>\n              <label className=\"block text-sm font-medium text-slate-700 mb-1.5\">کورتییەک دەربارەی خۆت (بایۆ)</label>"
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
