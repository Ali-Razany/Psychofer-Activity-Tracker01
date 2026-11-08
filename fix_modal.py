with open('src/components/ProfileSettingsModal.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "const [telegramChatId," in line and not skip:
        new_lines.append("  const [telegramChatId, setTelegramChatId] = useState(user.telegramChatId || '');\n")
        skip = True
    elif skip and "|| '');" in line:
        skip = False
    elif skip:
        pass
    else:
        new_lines.append(line)

with open('src/components/ProfileSettingsModal.tsx', 'w') as f:
    f.writelines(new_lines)
