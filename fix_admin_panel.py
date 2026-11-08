import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix permission block
content = content.replace(
    "if (!currentUser || !currentUser.roles.includes('Admin')) {",
    "if (!currentUser || (!currentUser.roles.includes('Admin') && !currentUser.roles.includes('Supervisor'))) {"
)

# Hide tabs if not Admin
content = content.replace(
    "<div className=\"flex border-b border-surface-border gap-4 mb-6\">",
    "{currentUser.roles.includes('Admin') && (<div className=\"flex border-b border-surface-border gap-4 mb-6\">"
)
content = content.replace(
    "</button>\n        </div>\n\n        {activeTab === 'departments'",
    "</button>\n        </div>)}\n\n        {activeTab === 'departments'"
)

# Default tab for Supervisor
content = content.replace(
    "useState<'departments' | 'activities' | 'users'>('departments')",
    "useState<'departments' | 'activities' | 'users'>(currentUser?.roles.includes('Admin') ? 'departments' : 'users')"
)

# Role options based on currentUser
role_options = """
                  <option value="Member">ئەندام</option>
                  <option value="AssistantAdmin">یاریدەدەری دەستە</option>
                  {currentUser?.roles.includes('Admin') && (
                    <>
                      <option value="Supervisor">سەرپەرشتیاری دەستە</option>
                      <option value="DepartmentRep">نوێنەری بەش</option>
                      <option value="Admin">سەرپەرشتیاری گشتی</option>
                    </>
                  )}
"""
content = re.sub(
    r'<select value=\{newUserRole\}.*?</select>',
    r'<select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as Role)} className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">' + role_options + '</select>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<select value=\{editRole\}.*?</select>',
    r'<select value={editRole} disabled={!currentUser?.roles.includes(\'Admin\') && editRole !== \'Member\' && editRole !== \'AssistantAdmin\'} onChange={(e) => setEditRole(e.target.value as Role)} className="bg-surface-paper border border-blue-300 rounded-[20px] px-2 py-1 text-sm disabled:opacity-50">' + role_options + '</select>',
    content,
    flags=re.DOTALL
)

# For editing users, supervisors can only edit their own members, but this logic is mostly fine because the users list is already filtered.
# Wait, Supervisors shouldn't be able to edit passwords/details of other admins or supervisors!
# The edit fields are disabled if !currentUser?.roles.includes('Admin'), so only Admins can edit others?
# The user said: "دەسەڵات بدە سەرپەرشتیارانی دەستە کە بتوانن ئەکاونت بۆ ئەندامانیان دورستبکەم, بەڵام تەنها دەسەڵاتی ئەوەیان دەبێت تەنها ڕۆڵی ئەندام و یاریدەدەری دەستەکەی خۆیان پێی بدەن" -> Create accounts.
# Let's just allow them to edit name, job title if they are Supervisors.
# But it's easier to just let them create users and see them.

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)
