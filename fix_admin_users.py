import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace prop types in UsersManager
content = content.replace(
    "updateUserRole: (id: string, r: Role, d: string) => void",
    "updateUserRole: (id: string, r: Role[], d: string[]) => void"
)
content = content.replace(
    "updateUserAdmin: (id: string, n: string, r: Role, d: string, jt?: string, t?: string) => void",
    "updateUserAdmin: (id: string, n: string, r: Role[], d: string[], jt?: string, t?: string) => void"
)

# Replace state initialization
content = content.replace(
    "const [newUserRole, setNewUserRole] = useState<Role>('Member');",
    "const [newUserRoles, setNewUserRoles] = useState<Role[]>(['Member']);"
)
content = content.replace(
    "const [newUserDept, setNewUserDept] = useState((currentUser?.roles || []).includes('Supervisor') ? (currentUser?.departments?.[0] || \"\") : (departments?.[0]?.id || ''));",
    "const [newUserDepts, setNewUserDepts] = useState<string[]>((currentUser?.roles || []).includes('Supervisor') ? (currentUser?.departments || []) : [departments?.[0]?.id || '']);"
)

# Replace handleAdd references
content = content.replace(
    "if (newUserName && newUserDept && newUserEmail && newUserPass) {",
    "if (newUserName && newUserDepts.length > 0 && newUserEmail && newUserPass) {"
)
content = content.replace(
    "roles: [newUserRole],",
    "roles: newUserRoles,"
)
content = content.replace(
    "departments: [newUserDept],",
    "departments: newUserDepts,"
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
