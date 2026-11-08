import os
import re

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Layout.tsx
    if 'Layout.tsx' in path:
        content = content.replace("currentUser.role !== 'DepartmentRep'", "!currentUser.roles.includes('DepartmentRep')")
        content = content.replace("['Admin', 'AssistantAdmin', 'Supervisor'].includes(currentUser.role)", "currentUser.roles.some(r => ['Admin', 'AssistantAdmin', 'Supervisor'].includes(r))")
        content = content.replace("['Admin', 'Supervisor'].includes(currentUser.role)", "currentUser.roles.some(r => ['Admin', 'Supervisor'].includes(r))")
        content = content.replace("currentUser.role === 'Admin'", "currentUser.roles.includes('Admin')")
        content = content.replace("currentUser.role === 'AssistantAdmin'", "currentUser.roles.includes('AssistantAdmin')")
        content = content.replace("currentUser.role === 'DepartmentRep'", "currentUser.roles.includes('DepartmentRep')")
        content = content.replace("currentUser.role === 'Supervisor'", "currentUser.roles.includes('Supervisor')")

    # Reports.tsx
    if 'Reports.tsx' in path:
        content = content.replace("['Supervisor', 'DepartmentRep', 'AssistantAdmin', 'Admin'].includes(currentUser.role)", "currentUser.roles.some(r => ['Supervisor', 'DepartmentRep', 'AssistantAdmin', 'Admin'].includes(r))")
        content = content.replace("['DepartmentRep', 'AssistantAdmin', 'Admin'].includes(currentUser.role)", "currentUser.roles.some(r => ['DepartmentRep', 'AssistantAdmin', 'Admin'].includes(r))")
        content = content.replace("user.department === currentUser.department", "user.departments.some(d => currentUser.departments.includes(d))")
        content = content.replace("currentUser.department", "currentUser.departments[0]")

    # AdminPanel.tsx
    if 'AdminPanel.tsx' in path:
        content = content.replace("currentUser.role !== 'Admin'", "!currentUser.roles.includes('Admin')")
        content = content.replace("currentUser?.role === 'Admin'", "currentUser?.roles.includes('Admin')")
        content = content.replace("currentUser?.role !== 'Admin'", "!currentUser?.roles.includes('Admin')")
        content = content.replace("currentUser?.role === 'Supervisor'", "currentUser?.roles.includes('Supervisor')")
        content = content.replace("u.department === currentUser?.department", "u.departments.some(d => currentUser?.departments.includes(d))")
        content = content.replace("currentUser.department", "currentUser.departments[0]")
        content = content.replace("u.role === 'Admin'", "u.roles.includes('Admin')")
        content = content.replace("u.role === 'AssistantAdmin'", "u.roles.includes('AssistantAdmin')")
        content = content.replace("u.role === 'DepartmentRep'", "u.roles.includes('DepartmentRep')")
        content = content.replace("u.role === 'Supervisor'", "u.roles.includes('Supervisor')")
        content = content.replace("u.role", "u.roles[0]")
        content = content.replace("u.department", "u.departments[0]")
        content = content.replace("user.department", "user.departments[0]")
        content = content.replace("user.role", "user.roles[0]")

    # ProfilesList.tsx
    if 'ProfilesList.tsx' in path:
        content = content.replace("currentUser?.role === 'Admin'", "currentUser?.roles.includes('Admin')")
        content = content.replace("currentUser?.role === 'AssistantAdmin'", "currentUser?.roles.includes('AssistantAdmin')")
        content = content.replace("currentUser?.role === 'Supervisor'", "currentUser?.roles.includes('Supervisor')")
        content = content.replace("u.department === currentUser?.department", "u.departments.some(d => currentUser?.departments.includes(d))")
        content = content.replace("user.department", "user.departments[0]")
        content = content.replace("user.role", "user.roles[0]")
        content = content.replace("selectedUser.role", "selectedUser.roles[0]")
        content = content.replace("selectedUser.department", "selectedUser.departments[0]")
        content = content.replace("u.department", "u.departments[0]")

    # PrivateRoom.tsx
    if 'PrivateRoom.tsx' in path:
        content = content.replace("currentUser?.role === 'Admin'", "currentUser?.roles.includes('Admin')")
        content = content.replace("currentUser?.role === 'AssistantAdmin'", "currentUser?.roles.includes('AssistantAdmin')")
        content = content.replace("currentUser.department", "currentUser.departments[0]")

    # Approvals.tsx
    if 'Approvals.tsx' in path:
        content = content.replace("!['Admin', 'AssistantAdmin', 'Supervisor'].includes(currentUser.role)", "!currentUser.roles.some(r => ['Admin', 'AssistantAdmin', 'Supervisor'].includes(r))")
        content = content.replace("currentUser.role !== 'Admin'", "!currentUser.roles.includes('Admin')")
        content = content.replace("currentUser.role === 'Admin'", "currentUser.roles.includes('Admin')")

    # AppContext.tsx
    if 'AppContext.tsx' in path:
        content = content.replace("role: userData.role", "roles: userData.roles || [userData.role || 'Member']")
        content = content.replace("department: userData.department", "departments: userData.departments || [userData.department || '']")

    # Dashboard.tsx
    if 'Dashboard.tsx' in path:
        content = content.replace("currentUser.department", "currentUser.departments[0]")
        content = content.replace("user.department", "user.departments[0]")
        content = content.replace("a.department", "a.departments[0]") # Wait, activities have department? Yes, single department.

    # ActivityForm.tsx
    if 'ActivityForm.tsx' in path:
        content = content.replace("currentUser.department", "currentUser.departments[0]")

    # ProfileSettingsModal.tsx
    if 'ProfileSettingsModal.tsx' in path:
        content = content.replace("currentUser.role", "currentUser.roles[0]")
        content = content.replace("currentUser.department", "currentUser.departments[0]")
        content = content.replace("setRole", "setRoles")
        content = content.replace("setDepartment", "setDepartments")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

