import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

edit_old = r'<div className="flex-1 flex flex-col md:flex-row flex-wrap gap-2">.*?<button onClick=\{.*?\} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-\[20px\]">\s*<Icon icon="hugeicons:floppy-disk" width=\{18\} />\s*</button>\s*</div>'
edit_new = """<div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none" placeholder="ناو" />
                  <input value={editJobTitle} onChange={e => setEditJobTitle(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="پیشە" />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <input type="text" placeholder="ئایدی تێلیگرام" value={editTelegramId} onChange={e => setEditTelegramId(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                  <input type="text" placeholder="پاسۆردی نوێ" value={editPassword} onChange={e => setEditPassword(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <select value={editRole} disabled={!(currentUser?.roles || []).includes('Admin') && editRole !== 'Member' && editRole !== 'AssistantAdmin'} onChange={(e) => setEditRole(e.target.value as Role)} className="flex-1 bg-surface-paper border border-blue-300 rounded-[20px] px-3 py-2 text-sm disabled:opacity-50 focus:ring-2 focus:ring-primary/50 outline-none">
                    <option value="Member">ئەندام</option>
                    <option value="AssistantAdmin">یاریدەدەری دەستە</option>
                    {(currentUser?.roles || []).includes('Admin') && (
                      <>
                        <option value="Supervisor">سەرپەرشتیاری دەستە</option>
                        <option value="DepartmentRep">نوێنەری بەش</option>
                        <option value="Admin">سەرپەرشتیاری گشتی</option>
                      </>
                    )}
                  </select>
                  <select value={editDept} disabled={!(currentUser?.roles || []).includes('Admin')} onChange={(e) => setEditDept(e.target.value)} className="flex-1 bg-surface-paper border border-blue-300 rounded-[20px] px-3 py-2 text-sm disabled:opacity-50 focus:ring-2 focus:ring-primary/50 outline-none">
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-end mt-1">
                  <button onClick={() => saveEdit(u)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-[20px] font-medium transition-colors flex items-center gap-2">
                    <Icon icon="hugeicons:floppy-disk" width={18} /> پاشەکەوتکردن
                  </button>
                </div>
              </div>"""

content = re.sub(edit_old, edit_new, content, flags=re.DOTALL)
with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
