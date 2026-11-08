const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const updatedCode = `import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { DepartmentInfo } from '../types';

export function DepartmentsList({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { departments, users, currentUser, updateDepartment, setViewProfileId } = useAppContext();
  
  const [editingDept, setEditingDept] = useState<DepartmentInfo | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  const canEditDept = (deptId: string) => {
    if (!currentUser) return false;
    if (currentUser.roles?.some(r => ['Admin', 'AssistantAdmin'].includes(r))) return true;
    if (currentUser.roles?.includes('Supervisor') && currentUser.departments?.includes(deptId)) return true;
    return false;
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      await updateDepartment(editingDept);
      setEditingDept(null);
    } catch (error) {
      console.error(error);
      alert('هەڵەیەک ڕوویدا');
    }
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case 'Admin': return 'سەرپەرشتیاری گشتی';
      case 'AssistantAdmin': return 'یاریدەدەری سەرپەرشتیار';
      case 'DepartmentRep': return 'نوێنەری بەش';
      case 'Supervisor': return 'سەرپەرشتیاری دەستە';
      default: return 'ئەندام';
    }
  };

  // View 1: Main Departments Grid
  if (!selectedDeptId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">دەستەکان</h1>
            <p className="text-sm text-neutral-500 mt-1">ناساندن و ئەندامانی دەستەکان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
            const colorClass = dept.color || 'bg-primary';
            
            return (
              <div 
                key={dept.id} 
                onClick={() => setSelectedDeptId(dept.id)}
                className="bg-surface-paper rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-surface-border cursor-pointer group"
              >
                <div className={\`h-32 flex items-center justify-center \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass} relative overflow-hidden\`}
                     style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon icon={dept.icon || "hugeicons:building-03"} width={32} />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-extrabold text-neutral-800 mb-1 group-hover:text-primary transition-colors">{dept.name}</h3>
                  <p className="text-neutral-500 font-medium text-sm flex items-center justify-center gap-1.5">
                    <Icon icon="mynaui:users-group" width={16} />
                    {deptUsers.length} ئەندام
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // View 2: Detailed Department Page
  const dept = departments.find(d => d.id === selectedDeptId);
  if (!dept) {
    setSelectedDeptId(null);
    return null;
  }

  const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
  const colorClass = dept.color || 'bg-primary';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-paper border border-surface-border text-neutral-600 hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <Icon icon="hugeicons:arrow-right-01" width={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">پەڕەی دەستە</h1>
          <p className="text-sm text-neutral-500 mt-1">زانیاری و ئەندامانی دەستە</p>
        </div>
      </div>

      <div className="bg-surface-paper rounded-[32px] overflow-hidden shadow-sm border border-surface-border">
        {/* Header */}
        <div className={\`p-6 md:p-8 flex items-center justify-between \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass} relative overflow-hidden\`}
             style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
          {/* Overlay gradient to make text readable usually if it's solid */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Icon icon={dept.icon || "hugeicons:building-03"} width={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">{dept.name}</h2>
              <p className="text-white/90 mt-1 font-medium">{deptUsers.length} ئەندام</p>
            </div>
          </div>
          
          {canEditDept(dept.id) && (
            <button 
              onClick={() => setEditingDept(dept)}
              className="relative z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors border border-white/30"
              title="دەستکاری دەستە"
            >
              <Icon icon="hugeicons:edit-02" width={20} />
            </button>
          )}
        </div>

        {/* Manifesto Section */}
        <div className="p-6 md:p-8 border-b border-surface-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="hugeicons:document-text" width={22} className="text-primary" />
              کارنامەی دەستە
            </h3>
          </div>
          
          <div className="bg-neutral-50 p-6 rounded-[24px] border border-neutral-100 prose prose-neutral max-w-none prose-p:leading-relaxed">
            {dept.manifesto ? (
              <div className="whitespace-pre-wrap text-neutral-700">{dept.manifesto}</div>
            ) : (
              <div className="text-center py-6 text-neutral-400 font-medium">
                هێشتا کارنامە نەنووسراوە
              </div>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="p-6 md:p-8 bg-surface-bg/30">
          <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <Icon icon="mynaui:users-group" width={22} className="text-primary" />
            ئەندامەکانی دەستە
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white p-4 rounded-[24px] border border-surface-border flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => {
                  if (onNavigate) {
                    setViewProfileId(user.id);
                    onNavigate('profiles');
                  }
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-full bg-white p-0.5">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-light/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-800 text-base truncate group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{getRoleName(user.roles?.[0] || 'Member')} {user.jobTitle ? \`• \${user.jobTitle}\` : ''}</p>
                </div>
              </div>
            ))}
            {deptUsers.length === 0 && (
              <div className="col-span-full text-center py-8 text-neutral-400 font-medium">
                هیچ ئەندامێک نەدۆزرایەوە
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      <AnimatePresence>
        {editingDept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setEditingDept(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-paper rounded-[32px] shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-neutral-900">دەستکاری دەستە: {editingDept.name}</h3>
                <button onClick={() => setEditingDept(null)} className="p-2 text-neutral-500 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors">
                  <Icon icon="mynaui:x" width={20} />
                </button>
              </div>

              <form onSubmit={handleSaveDepartment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ناوی دەستە</label>
                  <input
                    type="text"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({...editingDept, name: e.target.value})}
                    className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ئایکۆن (Iconify)</label>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-bg border border-surface-border flex items-center justify-center shrink-0 text-neutral-500">
                        <Icon icon={editingDept.icon || "hugeicons:building-03"} width={24} />
                      </div>
                      <input
                        type="text"
                        value={editingDept.icon || ''}
                        onChange={(e) => setEditingDept({...editingDept, icon: e.target.value})}
                        placeholder="hugeicons:building-03"
                        className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ڕەنگ (CSS Class / HEX)</label>
                    <div className="flex gap-3">
                      <div className={\`w-12 h-12 rounded-xl border border-surface-border shrink-0 \${editingDept.color || 'bg-primary'}\`} style={(editingDept.color?.startsWith('#') || editingDept.color?.startsWith('rgb')) ? {backgroundColor: editingDept.color} : {}}></div>
                      <input
                        type="text"
                        value={editingDept.color || ''}
                        onChange={(e) => setEditingDept({...editingDept, color: e.target.value})}
                        placeholder="#FF5733"
                        className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">کارنامەی دەستە (Manifesto)</label>
                  <textarea
                    value={editingDept.manifesto || ''}
                    onChange={(e) => setEditingDept({...editingDept, manifesto: e.target.value})}
                    rows={8}
                    placeholder="لێرەدا کارنامە و ئامانجەکانی دەستە بنووسە..."
                    className="w-full bg-surface-bg border border-surface-border rounded-[24px] px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="px-6 py-3 rounded-[20px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    پاشگەزبوونەوە
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-[20px] font-bold shadow-md transition-all"
                  >
                    پاشەکەوتکردن
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync('src/components/DepartmentsList.tsx', updatedCode);
