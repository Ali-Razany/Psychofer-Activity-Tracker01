import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace users list style
# <div key={u.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-surface-bg rounded-[20px] border border-surface-border gap-4">

content = content.replace(
    'className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-surface-bg rounded-[20px] border border-surface-border gap-4"',
    'className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border gap-4 hover:shadow-custom transition-shadow"'
)

# And activities
content = content.replace(
    'className="flex items-center justify-between p-3 bg-surface-bg rounded-[20px] border border-surface-border"',
    'className="flex items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border hover:shadow-custom transition-shadow"'
)

# And departments
content = content.replace(
    'className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-surface-bg rounded-[20px] border border-surface-border gap-4 hover:shadow-custom transition-shadow"',
    'className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border gap-4 hover:shadow-custom transition-shadow"'
)
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
