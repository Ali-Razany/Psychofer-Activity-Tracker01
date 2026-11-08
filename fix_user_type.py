import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("  avatar?: string;", "  avatar?: string;\n  fcmToken?: string;")

with open('src/types.ts', 'w') as f:
    f.write(content)

