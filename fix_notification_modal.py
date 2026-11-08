import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("await Notification.requestPermission()", "await window.Notification.requestPermission()")
content = content.replace("new Notification(", "new window.Notification(")

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
