const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Update imports
content = content.replace(
  "ActivityTask, Role, User } from '../types';",
  "ActivityTask, Role, User, CustomBadge } from '../types';"
);

// Destructure from AppContext
content = content.replace(
  "activities, addActivity, updateActivity,",
  "activities, addActivity, updateActivity, customBadges, addCustomBadge, updateCustomBadge, deleteCustomBadge,"
);

// Update activeTab state
content = content.replace(
  "useState<'departments' | 'activities' | 'users'>",
  "useState<'departments' | 'activities' | 'users' | 'badges'>"
);

// Add Tab Button
const userTabBtn = `              onClick={() => setActiveTab('users')}
              className={\`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap \${
                activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }\`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="mynaui:users" width={20} /> بەکارهێنەران
              </div>
            </button>`;

const badgeTabBtn = `
            <button
              onClick={() => setActiveTab('badges')}
              className={\`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap \${
                activeTab === 'badges' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }\`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="fluent-emoji:sports-medal" width={20} /> نیشانەکان
              </div>
            </button>
`;
content = content.replace(userTabBtn, userTabBtn + badgeTabBtn);

// Add Manager Component inside render
const userManager = `{activeTab === 'users' && <UsersManager users={users} departments={departments} addUser={addUser} updateUserRole={updateUserRole} updateUserAdmin={updateUserAdmin} deleteUserAdmin={deleteUserAdmin} updateUserPasswordAdmin={updateUserPasswordAdmin} currentUser={currentUser} />}`;
const badgeManager = `{activeTab === 'badges' && <BadgesManager customBadges={customBadges} addCustomBadge={addCustomBadge} deleteCustomBadge={deleteCustomBadge} />}`;
content = content.replace(userManager, userManager + '\n          ' + badgeManager);


fs.writeFileSync('src/components/AdminPanel.tsx', content);

// Now write the BadgesManager component
const badgesManagerCode = `
function BadgesManager({ customBadges, addCustomBadge, deleteCustomBadge }: { customBadges: CustomBadge[], addCustomBadge: (b: CustomBadge) => Promise<void>, deleteCustomBadge: (id: string) => Promise<void> }) {
  const [newBadge, setNewBadge] = useState<Partial<CustomBadge>>({ id: '', label: '', desc: '', icon: 'fluent-emoji:sports-medal', bg: 'bg-blue-100', color: 'text-blue-600' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadge.id || !newBadge.label || !newBadge.desc) {
      setError('پێویستە هەموو زانیارییەکان پڕبکرێنەوە');
      return;
    }
    setLoading(true);
    try {
      await addCustomBadge(newBadge as CustomBadge);
      setNewBadge({ id: '', label: '', desc: '', icon: 'fluent-emoji:sports-medal', bg: 'bg-blue-100', color: 'text-blue-600' });
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-sm">
        <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">زیادکردنی نیشانەی نوێ</h3>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-[16px] text-sm">{error}</div>}
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">ID ی نیشانە (بۆ نموونە: super_star)</label>
              <input
                type="text"
                value={newBadge.id}
                onChange={e => setNewBadge({...newBadge, id: e.target.value.toLowerCase()})}
                className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">ناوی نیشانە</label>
              <input
                type="text"
                value={newBadge.label}
                onChange={e => setNewBadge({...newBadge, label: e.target.value})}
                className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">ڕوونکردنەوەی نیشانە</label>
              <input
                type="text"
                value={newBadge.desc}
                onChange={e => setNewBadge({...newBadge, desc: e.target.value})}
                className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">ناوی ئایکۆن (لە iconify)</label>
              <input
                type="text"
                value={newBadge.icon}
                onChange={e => setNewBadge({...newBadge, icon: e.target.value})}
                className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-700 mb-1">ڕەنگی باکگراوەند</label>
                <input
                  type="text"
                  value={newBadge.bg}
                  onChange={e => setNewBadge({...newBadge, bg: e.target.value})}
                  className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="bg-blue-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-neutral-700 mb-1">ڕەنگی تێکست</label>
                <input
                  type="text"
                  value={newBadge.color}
                  onChange={e => setNewBadge({...newBadge, color: e.target.value})}
                  className="w-full border border-surface-border rounded-[16px] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="text-blue-600"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-[16px] font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'تکایە چاوەڕێبە...' : 'زیادکردنی نیشانە'}
          </button>
        </form>
      </div>

      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-sm">
        <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">لیستی نیشانەکان</h3>
        <div className="space-y-3">
          {customBadges.map(badge => (
            <div key={badge.id} className="p-4 border border-surface-border rounded-[20px] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={\`w-12 h-12 \${badge.bg} \${badge.color} rounded-full flex items-center justify-center shrink-0\`}>
                  <Icon icon={badge.icon} width={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-800">{badge.label}</h4>
                  <p className="text-xs text-neutral-500">{badge.desc}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (confirm('دڵنیایت لە سڕینەوەی ئەم نیشانەیە؟')) {
                    deleteCustomBadge(badge.id);
                  }
                }}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <Icon icon="fluent:delete-24-regular" width={20} />
              </button>
            </div>
          ))}
          {customBadges.length === 0 && (
            <p className="text-sm text-neutral-500 text-center py-4">هیچ نیشانەیەک بوونی نییە.</p>
          )}
        </div>
      </div>
    </div>
  );
}
`;
fs.appendFileSync('src/components/AdminPanel.tsx', '\n' + badgesManagerCode);
