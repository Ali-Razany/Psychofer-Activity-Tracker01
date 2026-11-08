import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Let's target the exact block in ActivitiesManager.
pattern = r'(<h3 className="text-lg font-bold text-neutral-800 mb-4">لیستی چالاکییەکان</h3>.*?<div key=\{a\.id\} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-\[20px\] border border-surface-border gap-4 hover:shadow-custom transition-shadow">\s*\{editingId === a\.id \? \(\s*)<div className="flex-1 flex flex-col gap-3">.*?(?=\)\s*:\s*\(\s*<>\s*<div className="flex-1">)'

def repl(m):
    return m.group(1) + """<div className="flex-1 flex flex-col md:flex-row gap-2">
                <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-[2] px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none" placeholder="ناو" />
                <input type="number" value={editPoints} onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none text-left" dir="ltr" placeholder="خاڵ" />
                <button onClick={() => saveEdit(a)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-[20px] font-medium transition-colors">
                  <Icon icon="hugeicons:floppy-disk" width={18} />
                </button>
              </div>
            """

content = re.sub(pattern, repl, content, flags=re.DOTALL)
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
