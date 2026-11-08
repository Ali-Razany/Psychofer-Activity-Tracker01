import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # currentUser.roles.includes -> (currentUser?.roles || []).includes
    # currentUser.roles.some -> (currentUser?.roles || []).some
    # u.roles.includes -> (u.roles || []).includes
    # u.departments.includes -> (u.departments || []).includes
    # currentUser.departments.includes -> (currentUser?.departments || []).includes
    
    content = re.sub(r'currentUser\.roles\.includes', r'(currentUser.roles || []).includes', content)
    content = re.sub(r'currentUser\?\.roles\.includes', r'(currentUser?.roles || []).includes', content)
    content = re.sub(r'currentUser\.roles\.some', r'(currentUser.roles || []).some', content)
    content = re.sub(r'currentUser\?\.roles\.some', r'(currentUser?.roles || []).some', content)
    
    content = re.sub(r'u\.roles\.includes', r'(u.roles || []).includes', content)
    content = re.sub(r'u\.roles\[0\]', r'(u.roles?.[0] || "Member")', content)
    
    content = re.sub(r'u\.departments\.includes', r'(u.departments || []).includes', content)
    content = re.sub(r'u\.departments\.some', r'(u.departments || []).some', content)
    
    content = re.sub(r'currentUser\.departments\.includes', r'(currentUser.departments || []).includes', content)
    content = re.sub(r'currentUser\?\.departments\.includes', r'(currentUser?.departments || []).includes', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

