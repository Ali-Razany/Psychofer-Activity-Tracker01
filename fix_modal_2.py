import re

with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'value=\{telegramChatId,\s*bio,\s*socials:\s*\{\s*telegram,\s*facebook,\s*instagram\s*\}\}',
    r'value={telegramChatId}',
    content
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
