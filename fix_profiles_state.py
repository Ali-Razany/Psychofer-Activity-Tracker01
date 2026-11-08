import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Add ReceiptModal state
state_pattern = re.compile(r'  const \[viewMode, setViewMode\] = useState<\'grid-large\' \| \'grid-small\' \| \'list\'>\(\'grid-small\'\);')

if state_pattern.search(content) and "receiptLog" not in content:
    content = state_pattern.sub("  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');\n  const [receiptLog, setReceiptLog] = useState<ActivityLog | null>(null);", content)
    print("State injected")
elif "receiptLog" in content:
    print("State already there")
else:
    print("State pattern not found")

# Update log mapping to include onClick and cursor-pointer
log_pattern = re.compile(r'<div key=\{log\.id\} className="flex items-center justify-between p-4 rounded-2xl bg-surface-bg hover:bg-white border border-transparent hover:border-surface-border hover:shadow-sm transition-all group">')

if log_pattern.search(content):
    content = log_pattern.sub('<div key={log.id} onClick={() => setReceiptLog(log)} className="flex items-center justify-between p-4 rounded-2xl bg-surface-bg hover:bg-white border border-transparent hover:border-surface-border hover:shadow-sm transition-all group cursor-pointer">', content)
    print("onClick added")
else:
    print("onClick pattern not found")
    
import_pattern = re.compile(r'import \{ Icon \} from \'@iconify/react\';')
if import_pattern.search(content) and "AnimatePresence" not in content:
    content = content.replace("import { Icon } from '@iconify/react';", "import { Icon } from '@iconify/react';\nimport { motion, AnimatePresence } from 'motion/react';")
    print("Imports added")

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)

