import re

with open('src/components/ArticlesEditor.tsx', 'r') as f:
    content = f.read()

# 1. Add font state
state_match = re.search(r'const \[editingArticleId, setEditingArticleId\] = useState<string \| null>\(null\);', content)
if state_match:
    content = content.replace(state_match.group(0), state_match.group(0) + "\n  const [articleFont, setArticleFont] = useState('system-ui, sans-serif');")

# 2. Add font dropdown next to the button
header_match = re.search(r'<div className="flex items-center justify-between">\s*<h2.*?</button>\s*</div>', content, flags=re.DOTALL)
if header_match:
    old_header = header_match.group(0)
    new_header = old_header.replace(
        '<button',
        '''<div className="flex items-center gap-3">
          <select 
            value={articleFont}
            onChange={(e) => setArticleFont(e.target.value)}
            className="bg-surface-paper border border-surface-border text-neutral-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="system-ui, sans-serif">فۆنتی بنەڕەتی</option>
            <option value="Arial, sans-serif">ئاریاڵ (Arial)</option>
            <option value="Tahoma, sans-serif">تاهۆما (Tahoma)</option>
            <option value="'Noto Naskh Arabic', serif">کلاسیک (Naskh)</option>
            <option value="'Noto Kufi Arabic', sans-serif">کوفی (Kufi)</option>
          </select>
          <button'''
    )
    new_header = new_header.replace('</button>\n      </div>', '</button>\n        </div>\n      </div>')
    content = content.replace(old_header, new_header)

# 3. Add font style to the article content
article_match = re.search(r'<section className="magazine-content">', content)
if article_match:
    content = content.replace(
        '<section className="magazine-content">',
        '<section className="magazine-content" style={{ fontFamily: articleFont }}>'
    )

# 4. Modify the aside to order-first and fix borders on lg
aside_match = re.search(r'<aside className="lg:col-span-4 border-t-4 lg:border-t-0 lg:border-r-4 border-neutral-900 pt-8 lg:pt-0 lg:pr-8">', content)
if aside_match:
    content = content.replace(
        aside_match.group(0),
        '<aside className="lg:col-span-4 lg:order-first border-t-4 lg:border-t-0 lg:border-l-4 lg:border-r-0 border-neutral-900 pt-8 lg:pt-0 lg:pl-8 lg:pr-0">'
    )

with open('src/components/ArticlesEditor.tsx', 'w') as f:
    f.write(content)

print("Font and Layout patched!")
