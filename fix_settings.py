import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [email, setEmail] = useState(user.email || '');", "const [email, setEmail] = useState(user.email || '');\n  const [name, setName] = useState(user.name || '');")

content = content.replace("avatar: avatarPreview,", "name,\n        avatar: avatarPreview,")

name_jsx = """
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ناوی تەواو</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="ناوی خۆت بنووسە"
              />
            </div>
"""

content = content.replace("<div className=\"space-y-4\">", "<div className=\"space-y-4\">\n" + name_jsx)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
