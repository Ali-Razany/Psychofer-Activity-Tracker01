import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const [editRole, setEditRole] = useState<Role>('Member');",
    "const [editRoles, setEditRoles] = useState<Role[]>([]);"
)
content = content.replace(
    "const [editDept, setEditDept] = useState('');",
    "const [editDepts, setEditDepts] = useState<string[]>([]);"
)

content = content.replace(
    "setEditRole((u.roles?.[0] || \"Member\"));",
    "setEditRoles(u.roles || ['Member']);"
)
content = content.replace(
    "setEditDept((u.departments?.[0] || \"\"));",
    "setEditDepts(u.departments || []);"
)

content = content.replace(
    "updateUserAdmin(u.id, editName, editRole, editDept, editJobTitle, editTelegramId);",
    "updateUserAdmin(u.id, editName, editRoles, editDepts, editJobTitle, editTelegramId);"
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
