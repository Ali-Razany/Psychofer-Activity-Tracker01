import re

with open('src/types.ts', 'r') as f:
    content = f.read()

content = content.replace("likes?: string[];", "likes?: string[];\n  reactions?: Record<string, string[]>;")

with open('src/types.ts', 'w') as f:
    f.write(content)
