import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace ActivitiesManager forms
act_form_old = r'<form onSubmit=\{handleAdd\} className="flex gap-4 mb-8">.*?</form>'
act_form_new = """<form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 mb-8">
        <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input 
          type="text" placeholder="ناوی چالاکی" value={newName} onChange={(e) => setNewName(e.target.value)}
          className="flex-[2] bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
        <input 
          type="number" placeholder="خاڵ" value={newPoints} onChange={(e) => setNewPoints(parseInt(e.target.value) || 0)}
          className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left" dir="ltr"
        />
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
          <Icon icon="hugeicons:plus-sign" width={20} /> زیادکردن
        </button>
      </form>"""

content = re.sub(act_form_old, act_form_new, content, count=1, flags=re.DOTALL)


# Users form
users_form_old = r'<form onSubmit=\{handleAdd\} className="mb-8">.*?</form>'
users_form_new = """<form onSubmit={handleAdd} className="bg-surface-bg/50 p-6 rounded-[24px] border border-surface-border/50 mb-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" placeholder="ناو (بۆ نموونە: ئەحمەد مستەفا)" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required
          />
          <input 
            type="text" placeholder="پیشە یان پلە (ئارەزوومەندانە)" value={newUserJobTitle} onChange={(e) => setNewUserJobTitle(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <input 
            type="email" placeholder="ئیمەیڵ" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left" dir="ltr" required
          />
          <input 
            type="password" placeholder="وشەی نهێنی (لانی کەم ٦ پیت)" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left" dir="ltr" required minLength={6}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as Role)} className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
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
          <select value={newUserDept} disabled={(currentUser?.roles || []).includes('Supervisor')} onChange={(e) => setNewUserDept(e.target.value)} className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50">
            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
            {loading ? <Icon icon="eos-icons:loading" width={20} className="animate-spin" /> : <Icon icon="hugeicons:user-add-01" width={20} />} 
            {loading ? 'لە زیادکردندایە...' : 'زیادکردنی بەکارهێنەر'}
          </button>
        </div>
      </form>"""

content = re.sub(users_form_old, users_form_new, content, count=1, flags=re.DOTALL)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
