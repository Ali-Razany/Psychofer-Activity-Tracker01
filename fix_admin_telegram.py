import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace("const [editTelegramId, setEditTelegramId] = useState('');", "")
content = content.replace("setEditTelegramId(u.telegramChatId || '');", "")
content = content.replace("updateUserAdmin(u.id, editName, editRoles, editDepts, editJobTitle, editTelegramId);", "updateUserAdmin(u.id, editName, editRoles, editDepts, editJobTitle);")

html_to_remove = """                  <input type="text" placeholder="ئایدی تێلیگرام" value={editTelegramId} onChange={e => setEditTelegramId(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" />"""

content = content.replace(html_to_remove, "")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const updateProfile = async (userId: string, data: { avatar?: string, email?: string, telegramChatId?: string }) => {",
    "const updateProfile = async (userId: string, data: { avatar?: string, email?: string }) => {"
)
content = content.replace(
    "const updateUserAdmin = async (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string, telegramChatId?: string) => {",
    "const updateUserAdmin = async (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string) => {"
)
content = content.replace(
    "await updateDoc(doc(db, 'users', userId), { name, roles, departments, jobTitle: jobTitle || '', telegramChatId: telegramChatId || '' });",
    "await updateDoc(doc(db, 'users', userId), { name, roles, departments, jobTitle: jobTitle || '' });"
)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
