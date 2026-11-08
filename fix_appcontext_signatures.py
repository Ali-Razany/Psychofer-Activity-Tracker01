import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "updateUserRole: (userId: string, role: Role, department: string) => Promise<void>;",
    "updateUserRole: (userId: string, roles: Role[], departments: string[]) => Promise<void>;"
)

content = content.replace(
    "updateUserAdmin: (userId: string, name: string, role: Role, department: string, jobTitle?: string, telegramChatId?: string) => Promise<void>;",
    "updateUserAdmin: (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string, telegramChatId?: string) => Promise<void>;"
)

content = content.replace(
    "const updateUserRole = async (userId: string, role: Role, department: string) => {",
    "const updateUserRole = async (userId: string, roles: Role[], departments: string[]) => {"
)
# We need to change the implementation inside updateUserRole:
# await updateDoc(doc(db, 'users', userId), { role, department });
# But wait, it might be setting `roles: [role]` now? Let's check the current body of updateUserRole.
