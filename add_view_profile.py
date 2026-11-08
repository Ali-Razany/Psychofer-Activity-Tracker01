import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

# Add to AppContextType
content = content.replace("addNotification: (userId: string, message: string, type: string) => Promise<void>;\n}", "addNotification: (userId: string, message: string, type: string) => Promise<void>;\n  viewProfileId: string | null;\n  setViewProfileId: (id: string | null) => void;\n}")

# Add to AppProvider
content = content.replace("const [activities, setActivities] = useState<ActivityTask[]>([]);", "const [activities, setActivities] = useState<ActivityTask[]>([]);\n  const [viewProfileId, setViewProfileId] = useState<string | null>(null);")

# Add to context value
content = content.replace("login, logout, addLog,", "login, logout, addLog, viewProfileId, setViewProfileId,")

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
