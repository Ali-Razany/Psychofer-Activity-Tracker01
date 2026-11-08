import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "updateProfile: (userId: string, data: { avatar?: string, email?: string, telegramChatId?: string }) => Promise<void>;",
    "updateProfile: (userId: string, data: { avatar?: string, email?: string }) => Promise<void>;"
)
content = content.replace(
    "updateUserAdmin: (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string, telegramChatId?: string) => Promise<void>;",
    "updateUserAdmin: (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string) => Promise<void>;"
)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("  telegramChatId?: string;\n", "")

with open('src/types.ts', 'w') as f:
    f.write(content)
