import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ku } from 'date-fns/locale';", "")
content = content.replace(", locale: ku", "")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

with open('src/components/PublicComments.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { ku } from 'date-fns/locale';", "")
content = content.replace(", locale: ku", "")

with open('src/components/PublicComments.tsx', 'w') as f:
    f.write(content)

