with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

fields = """
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">کورتییەک دەربارەی خۆت (بایۆ)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                placeholder="بایۆیەک بنووسە..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">تێلیگرام</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="@username"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">فەیسبووک</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="https://facebook.com/..."
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئینستاگرام</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="@username"
                dir="ltr"
              />
"""

content = content.replace(
    '</p>\n            </div>\n          </div>',
    '</p>\n' + fields + '            </div>\n          </div>'
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
