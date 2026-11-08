import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [telegramChatId, setTelegramChatId] = useState(user.telegramChatId || '');", "")
content = content.replace("telegramChatId,", "")

html_to_remove = """            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئایدی تێلیگرام (Telegram Chat ID)</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={e => setTelegramChatId(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="بۆ نموونە: 123456789"
                dir="ltr"
              />
              <p className="text-xs text-neutral-500 mt-1">ئەمە بۆ وەرگرتنی ئاگادارکردنەوەکانە لە ڕێگەی بۆتی تێلیگرامەوە.</p>

            </div>"""

content = content.replace(html_to_remove, "")

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
