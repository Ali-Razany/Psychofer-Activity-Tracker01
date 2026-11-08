import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { DepartmentInfo, ActivityTask, Role, User, CustomBadge } from '../types';
import { Icon } from '@iconify/react';

export function AdminPanel() {
  const { 
    currentUser, 
    departments, addDepartment, 
    activities, addActivity, updateActivity, customBadges, addCustomBadge, updateCustomBadge, deleteCustomBadge,
    users, addUser, updateUserRole, updateUserAdmin, deleteUserAdmin, updateUserPasswordAdmin
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'departments' | 'activities' | 'users' | 'badges'>((currentUser?.roles || []).includes('Admin') ? 'departments' : 'users');

  if (!currentUser || (!(currentUser.roles || []).includes('Admin') && !(currentUser.roles || []).includes('Supervisor'))) {
    return <div className="p-8 text-center text-neutral-500">تۆ دەسەڵاتی چوونە ژوورەوەت نییە بۆ ئەم بەشە.</div>;
  }

    return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
            <Icon icon="hugeicons:settings-01" width={36} />
          </div>
          <div>
            <h2 className="text-[14px] md:text-2xl font-bold mb-2">بەڕێوەبردن (Admin)</h2>
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
            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-3 font-medium text-sm md:text-base transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'badges' ? 'border-primary text-primary' : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon icon="fluent-emoji:sports-medal" width={20} /> نیشانەکان
              </div>
            </button>

          </div>
        )}

        <div className="animate-in fade-in duration-300">
          {activeTab === 'departments' && <DepartmentsManager departments={departments} addDepartment={addDepartment} />}
          {activeTab === 'activities' && <ActivitiesManager activities={activities} departments={departments} addActivity={addActivity} updateActivity={updateActivity} />}
          {activeTab === 'users' && <UsersManager users={users} departments={departments} addUser={addUser} updateUserRole={updateUserRole} updateUserAdmin={updateUserAdmin} deleteUserAdmin={deleteUserAdmin} updateUserPasswordAdmin={updateUserPasswordAdmin} currentUser={currentUser} />}
          {activeTab === 'badges' && <BadgesManager customBadges={customBadges} addCustomBadge={addCustomBadge} deleteCustomBadge={deleteCustomBadge} />}
        </div>
      </div>
    </div>
  );
}

function DepartmentsManager({ departments, addDepartment }: { departments: DepartmentInfo[], addDepartment: (d: DepartmentInfo) => void }) {
  const [newDeptId, setNewDeptId] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptId && newDeptName) {
      addDepartment({ id: newDeptId, name: newDeptName });
      setNewDeptId('');
      setNewDeptName('');
    }
  };

  return (
    <div>
      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">زیادکردنی دەستەی نوێ</h3>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-8">
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
      </form>

      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">لیستی دەستەکان</h3>
      <div className="space-y-2">
        {departments.map(d => (
          <div key={d.id} className="flex items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border hover:shadow-custom transition-shadow">
            <div>
              <span className="font-bold text-neutral-800">{d.name}</span>
              <span className="text-[12px] sm:text-sm text-neutral-500 ml-2">({d.id})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivitiesManager({ activities, departments, addActivity, updateActivity }: { activities: ActivityTask[], departments: DepartmentInfo[], addActivity: (a: ActivityTask) => void, updateActivity: (a: ActivityTask) => void }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState(0);
  const [editName, setEditName] = useState('');

  const [newDept, setNewDept] = useState(departments?.[0]?.id || '');
  const [newName, setNewName] = useState('');
  const [newPoints, setNewPoints] = useState(1);

  const startEdit = (a: ActivityTask) => {
    setEditingId(a.id);
    setEditName(a.name);
    setEditPoints(a.basePoints);
  };

  const saveEdit = (a: ActivityTask) => {
    updateActivity({ ...a, name: editName, basePoints: editPoints });
    setEditingId(null);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName && newDept && newPoints > 0) {
      addActivity({
        id: `act-${Math.random().toString(36).substr(2, 6)}`,
        department: newDept,
        name: newName,
        basePoints: newPoints
      });
      setNewName('');
      setNewPoints(1);
    }
  };

  return (
    <div>
      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">زیادکردنی چالاکی نوێ</h3>
      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-3 mb-8">
        <select value={newDept} onChange={(e) => setNewDept(e.target.value)} className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input 
          type="text" placeholder="ناوی چالاکی" value={newName} onChange={(e) => setNewName(e.target.value)}
          className="flex-[2] bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required
        />
        <input 
          type="number" min="1" placeholder="خاڵ" value={newPoints} onChange={(e) => setNewPoints(parseInt(e.target.value) || 1)}
          className="w-full md:w-24 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left" dir="ltr" required
        />
        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
          <Icon icon="hugeicons:plus-sign" width={20} /> زیادکردن
        </button>
      </form>

      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">لیستی چالاکییەکان</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {activities.map(a => (
          <div key={a.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border gap-4 hover:shadow-custom transition-shadow">
            {editingId === a.id ? (
              <div className="flex-1 flex flex-col md:flex-row gap-2">
                <input value={editName} onChange={e => setEditName(e.target.value)} className="flex-[2] px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none" placeholder="ناو" />
                <input type="number" value={editPoints} onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none text-left" dir="ltr" placeholder="خاڵ" />
                <button onClick={() => saveEdit(a)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-[20px] font-medium transition-colors">
                  <Icon icon="hugeicons:floppy-disk" width={18} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <span className="font-bold text-neutral-800">{a.name}</span>
                  <div className="text-xs text-neutral-500">{departments.find(d => d.id === a.department)?.name || a.department}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="bg-primary-light/20 text-blue-800 px-3 py-1 rounded-full text-[12px] sm:text-sm font-bold">{a.basePoints} خاڵ</span>
                  <button onClick={() => startEdit(a)} className="text-slate-400 hover:text-primary">
                    <Icon icon="hugeicons:pencil-edit-02" width={18} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersManager({ users, departments, addUser, updateUserRole, updateUserAdmin, deleteUserAdmin, updateUserPasswordAdmin, currentUser }: { users: User[], departments: DepartmentInfo[], addUser: (email: string, pass: string, u: Omit<User, 'id'>) => Promise<void>, updateUserRole: (id: string, r: Role[], d: string[]) => void, updateUserAdmin: (id: string, n: string, r: Role[], d: string[], jt?: string, t?: string) => void, deleteUserAdmin: (id: string) => Promise<void>, updateUserPasswordAdmin: (id: string, p: string) => Promise<void>, currentUser: User | null }) {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRoles, setNewUserRoles] = useState<Role[]>(['Member']);
  const [newUserDepts, setNewUserDepts] = useState<string[]>((currentUser?.roles || []).includes('Supervisor') ? (currentUser?.departments || []) : (departments?.[0] ? [departments[0].id] : []));
  const [newUserJobTitle, setNewUserJobTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserDepts.length > 0 && newUserEmail && newUserPass) {
      setLoading(true);
      setError('');
      try {
        await addUser(newUserEmail, newUserPass, {
          name: newUserName,
          roles: newUserRoles,
          departments: newUserDepts,
          jobTitle: newUserJobTitle,
          points: 0
        });
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPass('');
      } catch (err: any) {
        setError(err.message || 'هەڵەیەک ڕوویدا');
      }
      setLoading(false);
    }
  };
  const [editRoles, setEditRoles] = useState<Role[]>([]);
  const [editDepts, setEditDepts] = useState<string[]>([]);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  

  const startEdit = (u: User) => {
    setEditingId(u.id);
    setEditName(u.name);
    setEditRoles(u.roles || ['Member']);
    setEditDepts(u.departments || []);
    setEditJobTitle(u.jobTitle || '');
    setEditPassword('');
    
  };
  const saveEdit = async (u: User) => {
    try {
      if (editPassword) {
        await updateUserPasswordAdmin(u.id, editPassword);
      }
      updateUserAdmin(u.id, editName, editRoles, editDepts, editJobTitle);
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };
  const handleDelete = async (u: User) => {
    if (confirm(`دڵنیایت دەتەوێت ${u.name} بسڕیتەوە؟ (ئەمە بەکارهێنەرەکە بەتەواوی لە سیستەمەکە دەسڕێتەوە)`)) {
      try {
        await deleteUserAdmin(u.id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div>
      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">زیادکردنی بەکارهێنەری نوێ</h3>
      {error && <div className="mb-4 text-[12px] sm:text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
      <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input 
          type="text" placeholder="ناوی بەکارهێنەر" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
          className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <input 
          type="text" placeholder="پیشە یان پلە (ئارەزوومەندانە)" value={newUserJobTitle} onChange={(e) => setNewUserJobTitle(e.target.value)}
          className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="email" placeholder="ئیمەیڵ" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)}
          className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" required
        />
        <input 
          type="password" placeholder="وشەی نهێنی (لانی کەم ٦ پیت)" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)}
          className="bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left" dir="ltr" required minLength={6}
        />
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <span className="text-[12px] sm:text-sm font-bold text-neutral-700 mb-2 block">ڕۆڵەکان:</span>
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
            <span className="text-[12px] sm:text-sm font-bold text-neutral-700 mb-2 block">دەستەکان:</span>
            <MultiSelectPills 
              options={departments.map(d => ({ value: d.id, label: d.name }))}
              selected={newUserDepts}
              onChange={setNewUserDepts}
              disabled={(currentUser?.roles || []).includes('Supervisor')}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full md:w-auto self-start mt-2 bg-primary text-white px-6 py-3 rounded-[20px] font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
            {loading ? <Icon icon="eos-icons:loading" width={20} className="animate-spin" /> : <Icon icon="hugeicons:user-add-01" width={20} />} 
            {loading ? 'لە زیادکردندایە...' : 'زیادکردنی بەکارهێنەر'}
          </button>
        </div>
      </form>
      <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4">لیستی بەکارهێنەران</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {users.filter(u => (currentUser?.roles || []).includes('Admin') || (u.departments || []).some(d => (currentUser?.departments || []).includes(d))).map(u => (
          <div key={u.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border gap-4 hover:shadow-custom transition-shadow">
            {editingId === u.id ? (
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-2">
                  <input value={editName} onChange={e => setEditName(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] focus:ring-2 focus:ring-primary/50 outline-none" placeholder="ناو" />
                  <input value={editJobTitle} onChange={e => setEditJobTitle(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="پیشە" />
                </div>
                <div className="flex flex-col md:flex-row gap-2">

                  <input type="text" placeholder="پاسۆردی نوێ" value={editPassword} onChange={e => setEditPassword(e.target.value)} disabled={!(currentUser?.roles || []).includes('Admin')} className="flex-1 px-3 py-2 bg-surface-paper border border-blue-300 rounded-[20px] text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div>
                    <span className="text-[12px] sm:text-sm font-bold text-neutral-700 mb-2 block">ڕۆڵەکان:</span>
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
                      selected={editRoles}
                      onChange={(s) => setEditRoles(s as Role[])}
                      disabled={!(currentUser?.roles || []).includes('Admin')}
                    />
                  </div>
                  <div>
                    <span className="text-[12px] sm:text-sm font-bold text-neutral-700 mb-2 block">دەستەکان:</span>
                    <MultiSelectPills 
                      options={departments.map(d => ({ value: d.id, label: d.name }))}
                      selected={editDepts}
                      onChange={setEditDepts}
                      disabled={!(currentUser?.roles || []).includes('Admin')}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-1">
                  <button onClick={() => saveEdit(u)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-[20px] font-medium transition-colors flex items-center gap-2">
                    <Icon icon="hugeicons:floppy-disk" width={18} /> پاشەکەوتکردن
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <span className="font-bold text-neutral-800">{u.name}</span>
                  {u.jobTitle && <span className="text-xs bg-surface-border text-neutral-600 px-2 py-0.5 rounded-md mr-2">{u.jobTitle}</span>}
                  <div className="text-xs text-neutral-500 mt-1 flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full ${
                      (u.roles || []).includes('Admin') ? 'bg-red-100 text-red-700' :
                      (u.roles || []).includes('AssistantAdmin') ? 'bg-orange-100 text-orange-700' :
                      (u.roles || []).includes('DepartmentRep') ? 'bg-indigo-100 text-indigo-700' :
                      (u.roles || []).includes('Supervisor') ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {
                        (u.roles || []).includes('Admin') ? 'سەرپەرشتیاری گشتی' : 
                        (u.roles || []).includes('AssistantAdmin') ? 'یاریدەدەری سەرپەرشتیار' :
                        (u.roles || []).includes('DepartmentRep') ? 'نوێنەری بەش' :
                        (u.roles || []).includes('Supervisor') ? 'سەرپەرشتیاری دەستە' : 'ئەندام'
                      }
                    </span>
                    <span className="bg-primary/10 text-primary-dark px-2 py-0.5 rounded-full">
                      {departments.find(d => d.id === (u.departments?.[0] || ""))?.name || (u.departments?.[0] || "")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {(currentUser?.roles || []).includes('Admin') && (
                  <>
                  <button onClick={() => startEdit(u)} className="text-slate-400 hover:text-primary">
                    <Icon icon="hugeicons:pencil-edit-02" width={18} />
                  </button>
                  <button onClick={() => handleDelete(u)} className="text-slate-400 hover:text-red-600">
                    <Icon icon="hugeicons:delete-02" width={18} />
                  </button>
                  </>
                )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultiSelectPills({ options, selected, onChange, disabled }: { options: {value: string, label: string}[], selected: string[], onChange: (s: string[]) => void, disabled?: boolean }) {
  const toggle = (val: string) => {
    if (disabled) return;
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const isSelected = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              isSelected 
                ? 'bg-primary text-white border-primary' 
                : 'bg-surface-paper text-neutral-600 border-surface-border hover:bg-slate-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}


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
                <div className={`w-12 h-12 ${badge.bg} ${badge.color} rounded-full flex items-center justify-center shrink-0`}>
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
