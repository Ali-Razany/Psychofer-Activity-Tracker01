import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { DepartmentInfo } from '../types';
import { AnimatedTooltip } from './ui/animated-tooltip';
import Strands from './ui/Strands';


export function DepartmentsList({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const getDeptColorInfo = (dept?: DepartmentInfo) => {
    if (!dept) return { bg: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)', strands: ['#94a3b8', '#cbd5e1', '#e2e8f0'] };
    const name = dept.name || '';
    
    if (name.includes('ڕاگەیاندن')) return { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', strands: ['#047857', '#10b981', '#6ee7b7', '#ffffff'] }; // Green
    if (name.includes('نەخشەسازی') || name.includes('دیزاین')) return { bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', strands: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'] }; // Blue
    if (name.includes('دۆبلاژ')) return { bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', strands: ['#6d28d9', '#8b5cf6', '#c4b5fd', '#ffffff'] }; // Violet
    if (name.includes('وەرگێڕان')) return { bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', strands: ['#c2410c', '#f97316', '#fdba74', '#ffffff'] }; // Orange
    if (name.includes('پێداچوونەوە')) return { bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)', strands: ['#be185d', '#ec4899', '#fbcfe8', '#ffffff'] }; // Pink
    if (name.includes('تایپ')) return { bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', strands: ['#0f766e', '#14b8a6', '#5eead4', '#ffffff'] }; // Teal
    if (name.includes('ئایتی') || name.includes('IT')) return { bg: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', strands: ['#4338ca', '#6366f1', '#a5b4fc', '#ffffff'] }; // Indigo
    
    // Fallback based on custom color or default
    const c = dept.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb'))) {
       return { bg: `linear-gradient(135deg, ${c} 0%, ${c}80 100%)`, strands: [c, '#ffffff'] };
    }
    
    return { bg: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)', strands: ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff'] };
  };

  const { departments, users, currentUser, updateDepartment, setViewProfileId } = useAppContext();
  
  const [editingDept, setEditingDept] = useState<DepartmentInfo | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState('');
  const { updateProfile } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid-small' | 'list'>('grid-small');

  const handleSaveBio = async () => {
    if (!selectedUser) return;
    try {
      await updateProfile(selectedUser.id, { bio: editBioText });
      setSelectedUser({ ...selectedUser, bio: editBioText });
      setIsEditingBio(false);
    } catch (error) {
      console.error(error);
      alert('هەڵەیەک ڕوویدا لە کاتی پاشەکەوتکردن');
    }
  };

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
      <div className="pb-16 max-w-6xl mx-auto">
        <div className="mb-12 text-center space-y-4 relative">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 text-primary">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" width={32} />
          </div>
          <h1 className="text-[14px] md:text-4xl font-extrabold text-neutral-900 tracking-tight">دەستەکان</h1>
          <p className="text-neutral-500 font-medium text-[12px] sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            ئەو تیمانەی کە بزوێنەری کارەکانن، هەریەکەیان بە ئەرک و تایبەتمەندی خۆیانەوە.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="flex bg-surface-bg border border-surface-border rounded-[20px] p-1">
              <button
                onClick={() => setViewMode('grid-small')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  viewMode === 'grid-small'
                    ? 'bg-white text-primary shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
                title="شێوازی تۆڕ (Grid)"
              >
                <Icon icon="hugeicons:grid-view" width={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
                title="شێوازی لیست (List)"
              >
                <Icon icon="hugeicons:list-view" width={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={viewMode === 'list' ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"}>
          {departments.map((dept, i) => {
            const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));

            const colorClass = dept.color || 'bg-primary';
            const isCustomColor = colorClass.startsWith('#') || colorClass.startsWith('rgb');
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                key={dept.id} 
                onClick={() => setSelectedDeptId(dept.id)}
                className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-neutral-100 cursor-pointer group flex flex-col relative overflow-hidden h-full"
              >
                {/* Decorative background blob */}
                <div 
                  className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none ${isCustomColor ? '' : colorClass}`}
                  style={isCustomColor ? { backgroundColor: colorClass } : {}}
                ></div>

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] shrink-0 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 ${isCustomColor ? '' : colorClass}`}
                       style={isCustomColor ? { backgroundColor: colorClass } : {}}>
                    <Icon icon={dept.icon || "solar:buildings-bold-duotone"} className="text-[20px] sm:text-[28px]" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 text-neutral-600 rounded-full text-[12px] sm:text-sm font-bold border border-neutral-100 group-hover:bg-neutral-100 transition-colors">
                    <Icon icon="solar:users-group-rounded-bold" width={16} className="text-neutral-400" />
                    <span>{deptUsers.length}</span>
                  </div>
                </div>

                <h3 className="text-[12px] sm:text-[14px] md:text-xl font-extrabold text-neutral-800 mb-2 sm:mb-3 group-hover:text-primary transition-colors relative z-10 line-clamp-1">{dept.name}</h3>
                <p className="text-neutral-500 text-[10px] sm:text-[12px] md:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 relative z-10 flex-grow">
                  {dept.manifesto ? dept.manifesto : 'زانیاری زیاتر لەسەر ئەم دەستەیە بخوێنەوە...'}
                </p>

                <div className="mt-auto pt-2 sm:pt-4 border-t border-neutral-100 flex items-center text-primary font-bold text-[10px] sm:text-sm relative z-10 group-hover:gap-2 transition-all">
                  <span>بینینی دەستە</span>
                  <Icon icon="solar:arrow-left-linear" width={16} className="rotate-180 rtl:rotate-0 mr-1 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0" />
                </div>
              </motion.div>
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
  const isCustomColor = colorClass.startsWith('#') || colorClass.startsWith('rgb');

  return (
    <div className="pb-16 max-w-5xl mx-auto space-y-8">
      {/* Header Cover Area */}
      <div className="bg-surface-paper overflow-hidden shadow-sm border border-neutral-100 rounded-[32px] w-full mb-8 relative">
        <div className="h-40 relative" style={{ background: getDeptColorInfo(dept).bg }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '120px', overflow: 'hidden' }}>
            <Strands 
              colors={getDeptColorInfo(dept).strands}
              count={3}
              speed={0.5}
              amplitude={1.5}
              waviness={1}
              thickness={1}
              glow={2}
              taper={2}
              spread={1}
              intensity={0.6}
              saturation={1.2}
              opacity={0.8}
              scale={1.5}
              glass={false}
            />
          </div>
          <button 
            onClick={() => setSelectedDeptId(null)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-neutral-700"
          >
            <Icon icon="solar:arrow-right-linear" width={22} />
          </button>
          {canEditDept(dept.id) && (
            <button 
              onClick={() => setEditingDept(dept)}
              className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-primary"
              title="دەستکاری دەستە"
            >
              <Icon icon="solar:pen-new-square-linear" width={22} />
            </button>
          )}
        </div>
        
        <div className="flex justify-center -mt-16 relative z-10">
          <div className="p-1 rounded-full shadow-lg" style={{ background: getDeptColorInfo(dept).bg }}>
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Icon icon={dept.icon || "solar:buildings-bold-duotone"} width={64} className="drop-shadow-md" />
            </div>
          </div>
        </div>

        <div className="text-center px-4 pt-4 pb-8 relative z-10">
          <h1 className="text-[14px] md:text-3xl font-extrabold text-neutral-900 tracking-tight">{dept.name}</h1>
          <div className="flex justify-center mt-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[12px] sm:text-sm font-bold flex items-center gap-1.5">
              <Icon icon="solar:users-group-rounded-bold" width={16} />
              {deptUsers.length} ئەندام
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm">
            <h3 className="text-[14px] md:text-xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon icon="solar:document-text-bold-duotone" width={22} />
              </div>
              کارنامە و ئامانجەکان
            </h3>
            
            <div className="prose prose-neutral max-w-none prose-p:leading-relaxed prose-p:text-neutral-600">
              {dept.manifesto ? (
                <div className="whitespace-pre-wrap">{dept.manifesto}</div>
              ) : (
                <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
                  <Icon icon="solar:pen-new-square-broken" width={48} className="mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500 font-medium">هێشتا کارنامە نەنووسراوە</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Members Gallery */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-[14px] md:text-xl font-bold text-neutral-900 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon icon="solar:users-group-two-rounded-bold-duotone" width={22} />
            </div>
            ئەندامەکانی دەستە
          </h3>
          
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100">
            {deptUsers.length > 0 ? (
              <div className="flex flex-row items-center justify-center w-full rtl:flex-row-reverse flex-wrap gap-y-4 py-8">
                <AnimatedTooltip 
                  items={deptUsers.map((u) => ({
                    id: u.id,
                    name: u.name,
                    designation: u.roles?.includes('Supervisor') ? 'سەرپەرشتیار' : 'ئەندام',
                    image: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=random&size=400`,
                    user: u
                  }))} 
                  onItemClick={(u) => {
                    setSelectedUser(u);
                    setEditBioText(u.bio || '');
                    setIsEditingBio(false);
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-neutral-100">
                  <Icon icon="solar:user-cross-bold-duotone" width={32} className="text-neutral-400" />
                </div>
                <p className="text-neutral-500 font-medium">هیچ ئەندامێک نەدۆزرایەوە</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setEditingDept(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[36px] shadow-2xl max-w-2xl w-full p-8 md:p-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[14px] font-bold text-neutral-900">دەستکاری دەستە</h3>
                <button onClick={() => setEditingDept(null)} className="w-10 h-10 flex items-center justify-center text-neutral-500 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-800 rounded-full transition-colors">
                  <Icon icon="solar:close-circle-bold" width={24} />
                </button>
              </div>

              <form onSubmit={handleSaveDepartment} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ناوی دەستە</label>
                  <input
                    type="text"
                    value={editingDept.name}
                    onChange={(e) => setEditingDept({...editingDept, name: e.target.value})}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-[20px] px-5 py-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-neutral-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">ئایکۆن (Iconify)</label>
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-500 shadow-sm">
                        <Icon icon={editingDept.icon || "solar:buildings-bold-duotone"} width={28} />
                      </div>
                      <input
                        type="text"
                        value={editingDept.icon || ''}
                        onChange={(e) => setEditingDept({...editingDept, icon: e.target.value})}
                        placeholder="solar:buildings-bold-duotone"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-[20px] px-5 py-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-neutral-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">ڕەنگ (CSS Class / HEX)</label>
                    <div className="flex gap-3">
                      <div className={`w-14 h-14 rounded-2xl border border-neutral-200 shrink-0 shadow-sm ${editingDept.color || 'bg-primary'}`} style={(editingDept.color?.startsWith('#') || editingDept.color?.startsWith('rgb')) ? {backgroundColor: editingDept.color} : {}}></div>
                      <input
                        type="text"
                        value={editingDept.color || ''}
                        onChange={(e) => setEditingDept({...editingDept, color: e.target.value})}
                        placeholder="#FF5733"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-[20px] px-5 py-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-neutral-800 text-left dir-ltr"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">کارنامەی دەستە</label>
                  <textarea
                    value={editingDept.manifesto || ''}
                    onChange={(e) => setEditingDept({...editingDept, manifesto: e.target.value})}
                    rows={6}
                    placeholder="لێرەدا کارنامە و ئامانجەکانی دەستە بنووسە..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-[24px] px-5 py-4 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-neutral-800 resize-y"
                  ></textarea>
                </div>

                <div className="pt-6 flex justify-end gap-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="px-6 py-4 rounded-[20px] font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    پاشگەزبوونەوە
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-[20px] font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
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
