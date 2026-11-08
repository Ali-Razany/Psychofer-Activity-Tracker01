with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'className="flex gap-2 mb-2"',
    'className="flex flex-col md:flex-row gap-2 mb-2"'
)

content = content.replace(
    'className="flex gap-2"',
    'className="flex flex-col md:flex-row gap-2"'
)

content = content.replace(
    'className="flex-1 flex gap-2"',
    'className="flex-1 flex flex-col md:flex-row flex-wrap gap-2"'
)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
