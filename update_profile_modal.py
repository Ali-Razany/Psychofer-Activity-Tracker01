import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

import_addition = """import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';"""

content = content.replace("import { Icon } from '@iconify/react';", "import { Icon } from '@iconify/react';\n" + import_addition)

state_addition = """
  const [telegram, setTelegram] = useState(user.socials?.telegram || '');
  const [verifyingTelegram, setVerifyingTelegram] = useState(false);
  
  const verifyTelegram = async () => {
    if (!telegram) return;
    setVerifyingTelegram(true);
    setError('');
    try {
      const tgDoc = await getDoc(doc(db, 'telegram_links', telegram.toLowerCase()));
      if (tgDoc.exists() && tgDoc.data().chatId) {
        // Link successful
        try {
          await updateProfile(user.id, { telegramChatId: tgDoc.data().chatId });
          setError('تێلیگرامەکەت سەرکەوتووانە پشتڕاستکرایەوە!');
        } catch(e) {
          setError('هەڵەیەک ڕوویدا لە پاشەکەوتکردندا.');
        }
      } else {
        setError('پشتڕاستکردنەوە سەرکەوتوو نەبوو. دڵنیابە لەوەی /start ت ناردووە بۆ بۆتەکە.');
      }
    } catch(err) {
      setError('هەڵەیەک ڕوویدا لەکاتی پەیوەندی کردن.');
    } finally {
      setVerifyingTelegram(false);
    }
  };
"""

content = re.sub(r"const \[telegram, setTelegram\] = useState\(user\.socials\?\.telegram \|\| ''\);", state_addition.strip(), content)

ui_addition = """
              <div className="flex gap-2">
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value.replace('@', ''))}
                  className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                  placeholder="username"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={verifyTelegram}
                  disabled={!telegram || verifyingTelegram}
                  className="bg-primary/10 text-primary hover:bg-primary/20 px-4 rounded-[20px] font-bold transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                >
                  {verifyingTelegram ? '...' : 'پشتڕاستکردنەوە'}
                </button>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">بۆ وەرگرتنی ئاگادارکردنەوەکان، یوزەرنەیمەکەت لێرە بنووسە و /start بنێرە بۆ <a href="https://t.me/PsychoferActivity2026bot" target="_blank" className="text-primary font-bold hover:underline">@PsychoferActivity2026bot</a> پاشان دوگمەی پشتڕاستکردنەوە دابگرە.</p>
"""

content = re.sub(r'<input\s*type="text"\s*value=\{telegram\}\s*onChange=\{\(e\) => setTelegram\(e\.target\.value\.replace\(\'@\', \'\'\)\)\}\s*className="w-full bg-surface-bg border border-surface-border rounded-\[20px\] px-4 py-2\.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"\s*placeholder="username"\s*dir="ltr"\s*/>\s*<p className="text-\[11px\] text-neutral-500 mt-1">بۆ وەرگرتنی ئاگادارکردنەوەکان، یوزەرنەیمەکەت لێرە بنووسە و /start بنێرە بۆ <a href="https://t.me/PsychoferActivity2026bot" target="_blank" className="text-primary font-bold hover:underline">@PsychoferActivity2026bot</a></p>', ui_addition.strip(), content)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
