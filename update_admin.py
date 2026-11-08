import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# I will replace the main AdminPanel container and inner stuff.
# First let's find the original return statement in AdminPanel.

admin_panel_start = """  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
            <Icon icon="hugeicons:settings-01" width={36} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">بەڕێوەبردن (Admin)</h2>
            <p className="text-white/80">لێرەدا دەتوانیت دەستەکان، چالاکییەکان، و بەکارهێنەران بەڕێوەببەیت.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-custom">
        {(currentUser.roles || []).includes('Admin') && (
          <div className="flex overflow-x-auto border-b border-surface-border gap-6 mb-8 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('departments')}
              className={`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'departments' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="hugeicons:folder-add" width={20} /> دەستەکان
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('activities')}
              className={`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'activities' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="hugeicons:activity-01" width={20} /> چالاکییەکان
              </div>
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="mynaui:users" width={20} /> بەکارهێنەران
              </div>
            </button>
          </div>
        )}

        <div className="animate-in fade-in duration-300">
          {activeTab === 'departments' && <DepartmentsManager departments={departments} addDepartment={addDepartment} />}
          {activeTab === 'activities' && <ActivitiesManager activities={activities} departments={departments} addActivity={addActivity} updateActivity={updateActivity} />}
          {activeTab === 'users' && <UsersManager users={users} departments={departments} addUser={addUser} updateUserRole={updateUserRole} updateUserAdmin={updateUserAdmin} deleteUserAdmin={deleteUserAdmin} updateUserPasswordAdmin={updateUserPasswordAdmin} currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );"""

# I need to match `return (\n    <div className="space-y-6">\n ... </div>\n  );`
old_pattern = r'return \(\s*<div className="space-y-6">.*?</div>\s*</div>\s*\);\s*\}'
# wait, the original ends with `</div>\n    </div>\n  );\n}`

new_content = re.sub(r'return \(\s*<div className="space-y-6">.*?</div>\s*</div>\s*\);', admin_panel_start, content, flags=re.DOTALL)


# DepartmentsManager update
dept_old = r'<form onSubmit=\{handleAdd\} className="flex gap-4 mb-8">.*?</form>'
dept_new = """<form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-8">
        <input 
          type="text"
          placeholder="ID دەستە (بۆ نموونە: IT)"
          value={newDeptId}
          onChange={(e) => setNewDeptId(e.target.value)}
          className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        />
        <input 
          type="text"
          placeholder="ناوی دەستە (بۆ نموونە: تەکنەلۆجیا)"
          value={newDeptName}
          onChange={(e) => setNewDeptName(e.target.value)}
          className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        />
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Icon icon="hugeicons:plus-sign" width={20} /> زیادکردن
        </button>
      </form>"""
new_content = re.sub(dept_old, dept_new, new_content, flags=re.DOTALL)

dept_list_old = r'<div className="space-y-2">.*?</div>'
# wait, there's another space-y-2 in ActivitiesManager and UsersManager...
# Let's write custom regex for each manager.

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(new_content)
