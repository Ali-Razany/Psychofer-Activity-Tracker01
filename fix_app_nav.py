import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("case 'dashboard': return <Dashboard />;", "case 'dashboard': return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;")

with open('src/App.tsx', 'w') as f:
    f.write(content)
