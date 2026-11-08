import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace Add User selects
add_selects_old = r'<div className="grid grid-cols-1 md:grid-cols-3 gap-4">\s*<select value=\{newUserRole\}.*?</select>\s*<select value=\{newUserDept\}.*?</select>\s*<button type="submit".*?</button>\s*</div>'

add_selects_new = """<div className="flex flex-col gap-3">
          <div>
            <span className="text-sm font-bold text-neutral-700 mb-1 block">ڕۆڵەکان:</span>
            <MultiSelectPills 
              options={[
                { value: 'Member', label: 'ئەندام' },
                { value: 'AssistantAdmin', label: 'یاریدەدەری دەستە' },
                ...((currentUser?.roles || []).includes('Admin') ? [
                  { value: 'Supervisor', label: 'سەرپەرشتیاری دەستە' },
                  { value: 'DepartmentRep', label: 'نوێنەری بەش' },
                  { value: 'Admin', label: 'سەرپەرشتیاری گشتی' }
                ] : [])
              ]}
              selected={newUserRoles}
              onChange={(s) => setNewUserRoles(s as Role[])}
            />
          </div>
          <div>
            <span className="text-sm font-bold text-neutral-700 mb-1 block">دەستەکان:</span>
            <MultiSelectPills 
              options={departments.map(d => ({ value: d.id, label: d.name }))}
              selected={newUserDepts}
              onChange={setNewUserDepts}
              disabled={(currentUser?.roles || []).includes('Supervisor')}
            />
          </div>
          <button type="submit" disabled={loading} className="mt-2 bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
            {loading ? <Icon icon="eos-icons:loading" width={20} className="animate-spin" /> : <Icon icon="hugeicons:user-add-01" width={20} />} 
            {loading ? 'لە زیادکردندایە...' : 'زیادکردنی بەکارهێنەر'}
          </button>
        </div>"""

content = re.sub(add_selects_old, add_selects_new, content, flags=re.DOTALL)

# But wait, looking at the grep, the add user form is NOT in grid. It's:
# <div className="flex flex-col md:flex-row gap-2">
# Let's check how it exactly looks.
