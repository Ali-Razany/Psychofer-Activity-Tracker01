import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "setCurrentUser({ id: user.uid, ...docSnap.data() } as User);",
    "const data = docSnap.data(); setCurrentUser({ id: user.uid, ...data, roles: data.roles || (data.role ? [data.role] : ['Member']), departments: data.departments || (data.department ? [data.department] : []) } as User);"
)

content = content.replace(
    "setRawUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User)));",
    """setRawUsers(snapshot.docs.map(d => {
            const data = d.data();
            return { id: d.id, ...data, roles: data.roles || (data.role ? [data.role] : ['Member']), departments: data.departments || (data.department ? [data.department] : []) } as User;
          }));"""
)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
