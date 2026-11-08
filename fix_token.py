import re

with open('server.ts', 'r') as f:
    content = f.read()

content = content.replace("const token = process.env.TELEGRAM_BOT_TOKEN;", "const token = process.env.TELEGRAM_BOT_TOKEN?.trim();")

with open('server.ts', 'w') as f:
    f.write(content)
