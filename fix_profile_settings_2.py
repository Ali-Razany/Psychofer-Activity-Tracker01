with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""const [telegramChatId,
        bio,
        socials: {
          telegram,
          facebook,
          instagram
        }, setTelegramChatId] = useState(user.telegramChatId || '');""",
"""const [telegramChatId, setTelegramChatId] = useState(user.telegramChatId || '');"""
)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.write(content)
