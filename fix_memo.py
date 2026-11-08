import re

with open('src/components/ActivityForm.tsx', 'r') as f:
    content = f.read()

content = content.replace('<Icon icon="fluent-emoji:memo" width={80} />', '<Icon icon="fluent-emoji:memo" className="w-16 h-16 md:w-20 md:h-20" />')

with open('src/components/ActivityForm.tsx', 'w') as f:
    f.write(content)
