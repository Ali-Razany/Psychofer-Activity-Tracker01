import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'currentUser\.departments\[0\]', r'(currentUser?.departments?.[0] || "")', content)
    content = re.sub(r'currentUser\?\.departments\[0\]', r'(currentUser?.departments?.[0] || "")', content)
    
    content = re.sub(r'u\.departments\[0\]', r'(u.departments?.[0] || "")', content)
    content = re.sub(r'user\.departments\[0\]', r'(user.departments?.[0] || "")', content)
    content = re.sub(r'selectedUser\.departments\[0\]', r'(selectedUser.departments?.[0] || "")', content)
    
    content = re.sub(r'a\.departments\[0\]', r'(a.departments?.[0] || "")', content)
    
    content = re.sub(r'u\.roles\[0\]', r'(u.roles?.[0] || "Member")', content)
    content = re.sub(r'user\.roles\[0\]', r'(user.roles?.[0] || "Member")', content)
    content = re.sub(r'selectedUser\.roles\[0\]', r'(selectedUser.roles?.[0] || "Member")', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
