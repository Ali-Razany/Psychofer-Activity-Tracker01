import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

replacement = """
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">تێلیگرام (یوزەرنەیم)</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value.replace('@', ''))}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="username"
                dir="ltr"
              />
              <p className="text-[11px] text-neutral-500 mt-1">بۆ وەرگرتنی ئاگادارکردنەوەکان، یوزەرنەیمەکەت لێرە بنووسە و /start بنێرە بۆ <a href="https://t.me/PsychoferActivity2026bot" target="_blank" className="text-primary font-bold hover:underline">@PsychoferActivity2026bot</a></p>
            </div>
"""

content = re.sub(r'<div>\s*<label className="block text-sm font-medium text-slate-700 mb-1\.5">تێلیگرام</label>\s*<input\s*type="text"\s*value=\{telegram\}\s*onChange=\{\(e\) => setTelegram\(e\.target\.value\)\}\s*className="w-full bg-surface-bg border border-surface-border rounded-\[20px\] px-4 py-2\.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"\s*placeholder="@username"\s*dir="ltr"\s*/>\s*</div>', replacement.strip(), content)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
