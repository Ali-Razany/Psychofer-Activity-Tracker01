import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("export function Dashboard() {", "export function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
