import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("Notification.permission", "window.Notification.permission")
content = content.replace("Notification.requestPermission", "window.Notification.requestPermission")
content = content.replace("new Notification(", "new window.Notification(")

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
