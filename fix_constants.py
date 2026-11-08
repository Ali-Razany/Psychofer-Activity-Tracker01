import re

with open('src/lib/constants.ts', 'r') as f:
    content = f.read()

content = re.sub(r'role: ([\'"].+?[\'"])', r'roles: [\1]', content)
content = re.sub(r'department: ([\'"].+?[\'"])(?=,\s*points)', r'departments: [\1]', content)

with open('src/lib/constants.ts', 'w') as f:
    f.write(content)
