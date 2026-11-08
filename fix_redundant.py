import re

with open('src/components/PrivateRoom.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const { notifications, markNotificationRead } = useAppContext();\n", "")

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.write(content)
