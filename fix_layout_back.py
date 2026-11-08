import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

pattern = r"            \{activeTab !== 'dashboard' && \(\n              <button\n                onClick=\{\(\) => setActiveTab\('dashboard'\)\}\n                className=\"mb-4 flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-primary transition-colors bg-surface-paper px-4 py-2 rounded-full border border-surface-border w-fit shadow-sm\"\n              >\n                <Icon icon=\"hugeicons:arrow-right-01\" width=\{18\} />\n                گەڕانەوە\n              </button>\n            \)\}\n"

content = re.sub(pattern, "", content)

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)
