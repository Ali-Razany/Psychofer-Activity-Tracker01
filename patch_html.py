import re

with open('index.html', 'r') as f:
    content = f.read()

font_link = '<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&family=Noto+Naskh+Arabic:wght@400..700&family=Noto+Kufi+Arabic:wght@400..900&display=swap" rel="stylesheet">'

if "Noto+Naskh+Arabic" not in content:
    content = content.replace(
        '<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet">',
        font_link
    )
    # If the exact match above failed (e.g., if there's no such link), just insert it before </head>
    if font_link not in content:
        content = content.replace('</head>', f'    {font_link}\n  </head>')

with open('index.html', 'w') as f:
    f.write(content)

print("HTML patched!")
