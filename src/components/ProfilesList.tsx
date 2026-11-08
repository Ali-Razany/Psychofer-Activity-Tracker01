import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';

import { User, ActivityLog } from '../types';
import ChromaGrid from './ChromaGrid';
import Strands from './ui/Strands';
import { getBadgeDetails } from '../lib/badges';

export function ProfilesList() {
  const { users, departments, logs, currentUser, awardBadge, activities, customBadges, viewProfileId, setViewProfileId, deleteActivityLog } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [logToDelete, setLogToDelete] = useState<ActivityLog | null>(null);
  const [isDeletingLog, setIsDeletingLog] = useState(false);

  const isAdmin = (currentUser?.roles || []).includes('Admin');

  useEffect(() => {
    if (viewProfileId) {
      const u = users.find(u => u.id === viewProfileId);
      if (u) setSelectedUser(u);
    }
  }, [viewProfileId, users]);

  useEffect(() => {
    if (!selectedUser && viewProfileId) {
      setViewProfileId(null);
    }
  }, [selectedUser, viewProfileId]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState('consistency');
  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');
  const [receiptLog, setReceiptLog] = useState<ActivityLog | null>(null);
  const [viewBadgeDetails, setViewBadgeDetails] = useState<any>(null);

  useEffect(() => {
    const handleOpenUserProfile = (e: any) => {
      const userId = e.detail?.userId;
      if (userId) {
        const userToSelect = users.find(u => u.id === userId);
        if (userToSelect) {
          setSelectedUser(userToSelect);
        }
      }
    };
    
    window.addEventListener('open-user-profile', handleOpenUserProfile);
    return () => window.removeEventListener('open-user-profile', handleOpenUserProfile);
  }, [users]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (departments.find(d => d.id === (u.departments?.[0] || ""))?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || (u.departments || []).includes(filterDept);
    const matchesRole = filterRole === 'all' || (u.roles || []).includes(filterRole as any) || (filterRole === 'Member' && (!u.roles || u.roles.length === 0));
    return matchesSearch && matchesDept && matchesRole;
  });

  const getRoleName = (role: string) => {
    switch(role) {
      case 'Admin': return 'سەرپەرشتیاری گشتی';
      case 'AssistantAdmin': return 'یاریدەدەری سەرپەرشتیار';
      case 'DepartmentRep': return 'نوێنەری بەش';
      case 'Supervisor': return 'سەرپەرشتیاری دەستە';
      default: return 'ئەندام';
    }
  };

  
  const getDeptColorInfo = (userDeps?: string[]) => {
    if (!userDeps || userDeps.length === 0) return { bg: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)', strands: ['#94a3b8', '#cbd5e1', '#e2e8f0'] };
    const id = userDeps[0];
    const dept = departments.find(d => d.id === id);
    const name = dept?.name || '';
    
    if (name.includes('ڕاگەیاندن')) return { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', strands: ['#047857', '#10b981', '#6ee7b7', '#ffffff'] }; // Green
    if (name.includes('نەخشەسازی') || name.includes('دیزاین')) return { bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', strands: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'] }; // Blue
    if (name.includes('دۆبلاژ')) return { bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', strands: ['#6d28d9', '#8b5cf6', '#c4b5fd', '#ffffff'] }; // Violet
    if (name.includes('وەرگێڕان')) return { bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', strands: ['#c2410c', '#f97316', '#fdba74', '#ffffff'] }; // Orange
    if (name.includes('پێداچوونەوە')) return { bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)', strands: ['#be185d', '#ec4899', '#fbcfe8', '#ffffff'] }; // Pink
    if (name.includes('تایپ')) return { bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', strands: ['#0f766e', '#14b8a6', '#5eead4', '#ffffff'] }; // Teal
    if (name.includes('ئایتی') || name.includes('IT')) return { bg: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', strands: ['#4338ca', '#6366f1', '#a5b4fc', '#ffffff'] }; // Indigo
    
    // Fallback based on custom color or default
    const c = dept?.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb'))) {
       return { bg: `linear-gradient(135deg, ${c} 0%, ${c}80 100%)`, strands: [c, '#ffffff'] };
    }
    
    return { bg: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)', strands: ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff'] };
  };

  const getGradientStyle = (userDeps?: string[]) => {
    return { background: getDeptColorInfo(userDeps).bg };
  };

  if (selectedUser) {
    const userLogs = logs.filter(l => l.userId === selectedUser.id && l.status === 'Approved').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Admins and DepartmentReps can award badges (you can adjust this logic based on your needs)
    const canAwardBadge = (currentUser?.roles || []).includes('Admin') || (currentUser?.roles || []).includes('AssistantAdmin') || (currentUser?.roles || []).includes('Supervisor');
    
    const handleAwardBadge = () => {
      awardBadge(selectedUser.id, {
        type: selectedBadge as any,
        dateAwarded: new Date().toISOString().split('T')[0]
      });
      setShowBadgeModal(false);
      // Update selectedUser locally to show immediate feedback
      setSelectedUser({
        ...selectedUser,
        badges: [...(selectedUser.badges || []), { type: selectedBadge as any, dateAwarded: new Date().toISOString().split('T')[0] }]
      });
    };
    
    return (
      <div className="h-full overflow-y-auto custom-scrollbar rtl bg-surface-bg" dir="rtl">
        <div className="w-full pb-8">
          
          {/* Friendly Profile Header */}
          <div className="bg-surface-paper overflow-hidden shadow-sm border-b border-surface-border w-full mb-8 relative">
            <div className="h-40 relative" style={{ background: getDeptColorInfo(selectedUser.departments).bg }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '120px', overflow: 'hidden' }}>
                <Strands 
                  colors={getDeptColorInfo(selectedUser.departments).strands}
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
              {selectedUser.id === currentUser?.id && (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-profile-settings'))}
                  className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-neutral-700"
                  title="دەستکاری پڕۆفایل"
                >
                  <Icon icon="hugeicons:settings-01" width={22} />
                </button>
              )}
              {canAwardBadge && (
                <button 
                  onClick={() => setShowBadgeModal(true)}
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-primary"
                  title="پێدانی نیشانە"
                >
                  <Icon icon="fluent-emoji:sports-medal" width={22} />
                </button>
              )}
            </div>
            
            <div className="flex justify-center -mt-16 relative z-10">
              <div className="p-1 rounded-full shadow-lg" style={getGradientStyle(selectedUser.departments)}>
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover bg-white shrink-0" />
                ) : (
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-gradient-to-br from-primary-light to-primary-light/50 flex items-center justify-center font-bold text-4xl md:text-5xl text-primary-dark shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center px-6 pb-8 md:pb-10 mt-4">
              <h2 className="text-[14px] md:text-3xl font-extrabold text-neutral-800 tracking-tight">{selectedUser.name}</h2>
              <p className="text-[12px] sm:text-sm font-medium text-neutral-500 mt-1.5 flex items-center justify-center gap-1.5">
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">{getRoleName((selectedUser.roles?.[0] || "Member"))}</span>
                {selectedUser.departments && selectedUser.departments.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="bg-primary-light/20 text-primary-dark px-2.5 py-0.5 rounded-full">{departments.find(d => d.id === selectedUser.departments[0])?.name || selectedUser.departments[0]}</span>
                  </>
                )}
                {selectedUser.jobTitle && (
                  <>
                    <span>•</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">{selectedUser.jobTitle}</span>
                  </>
                )}
              </p>

              <div className="mt-8 bg-neutral-50/80 rounded-2xl py-5 flex max-w-2xl mx-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-neutral-100">
                  <div className="flex-1 text-center border-l border-neutral-200/60">
                      <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1.5">
                        {selectedUser.points} <Icon icon="fluent-emoji:star" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">کۆی خاڵەکان</div>
                  </div>
                  <div className="flex-1 text-center border-l border-neutral-200/60">
                      <span className="text-2xl font-black text-emerald-500 flex items-center justify-center gap-1.5">
                        {userLogs.length} <Icon icon="fluent-emoji:chart-increasing" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">چالاکییەکان</div>
                  </div>
                  <div className="flex-1 text-center">
                      <span className="text-2xl font-black text-primary flex items-center justify-center gap-1.5">
                        {selectedUser.badges?.length || 0} <Icon icon="fluent-emoji:trophy" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">دەستکەوتەکان</div>
                  </div>
              </div>

              {selectedUser.bio && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <p className="text-neutral-600 leading-relaxed text-[12px] sm:text-sm md:text-base font-medium">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {/* Socials */}
              <div className="flex justify-center gap-5 mt-8">
                  {selectedUser.socials?.telegram && (
                    <a href={selectedUser.socials.telegram.startsWith('http') ? selectedUser.socials.telegram : `https://t.me/${selectedUser.socials.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-blue-50/80 border border-blue-100 hover:bg-blue-100 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="logos:telegram" width={20} />
                    </a>
                  )}
                  {selectedUser.socials?.facebook && (
                    <a href={selectedUser.socials.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-blue-50/80 border border-blue-100 hover:bg-blue-100 flex items-center justify-center text-blue-700 hover:text-blue-800 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="logos:facebook" width={22} />
                    </a>
                  )}
                  {selectedUser.socials?.instagram && (
                    <a href={selectedUser.socials.instagram.startsWith('http') ? selectedUser.socials.instagram : `https://instagram.com/${selectedUser.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-pink-50/80 border border-pink-100 hover:bg-pink-100 flex items-center justify-center text-pink-600 hover:text-pink-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="skill-icons:instagram" width={20} />
                    </a>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full">
            
            {/* Badges Bento */}
            <div className="bg-surface-paper border-y border-surface-border p-6 shadow-sm flex flex-col w-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icon icon="fluent-emoji:trophy" width={22} />
                </div>
                <h3 className="text-[14px] md:text-xl font-bold text-neutral-800">دەستکەوتەکان</h3>
              </div>
              
              <div className="flex-1">
                {(!selectedUser.badges || selectedUser.badges.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-70">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                      <Icon icon="fluent-emoji:seedling" width={32} className="grayscale" />
                    </div>
                    <p className="text-neutral-500 text-[12px] sm:text-sm font-medium">هێشتا هیچ دەستکەوتێکی نییە</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {selectedUser.badges.map((b, idx) => {
                      const info = getBadgeDetails(b.type, customBadges);
                      if (!info) return null;
                      return (
                        <button 
                          key={idx} 
                          onClick={() => setViewBadgeDetails({...info, date: b.dateAwarded || '', note: b.note})}
                          className={`${info.bg} ${info.color} p-2.5 rounded-full flex items-center justify-center border border-white/40 shadow-sm relative overflow-hidden group hover:scale-105 transition-transform`}
                          title={info.label}
                        >
                          <div className="w-8 h-8 flex items-center justify-center shrink-0">
                            <Icon icon={info.icon} width={26} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Activity History Bento */}
            <div className="bg-surface-paper border-y border-surface-border p-6 shadow-sm flex flex-col w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon icon="fluent-emoji:chart-increasing" width={22} />
                  </div>
                  <h3 className="text-[14px] md:text-xl font-bold text-neutral-800">نوێترین چالاکییەکان</h3>
                </div>
                <div className="text-[12px] sm:text-sm font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  کۆی گشتی: {userLogs.length}
                </div>
              </div>

              <div className="flex-1 px-4">
                {userLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-70">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                      <Icon icon="fluent-emoji:sleeping-face" width={40} />
                    </div>
                    <p className="text-neutral-500 font-medium">هێشتا هیچ چالاکییەکی ئەنجام نەداوە.</p>
                  </div>
                ) : (
                  <ol className="relative space-y-8 before:absolute before:-ms-px before:h-full before:w-0.5 before:rounded-full before:bg-neutral-200 ml-4 rtl:ml-0 rtl:mr-4 rtl:before:right-0 rtl:before:-mr-px">
                    {userLogs.slice(0, 10).map((log, i) => {
                      const activityTask = activities.find(a => a.id === log.taskId);
                      return (
                        <li key={log.id} onClick={() => setReceiptLog(log)} className="relative rtl:-mr-1.5 ltr:-ms-1.5 flex items-start gap-4 cursor-pointer group hover:bg-neutral-50/50 p-2 -my-2 rounded-xl transition-colors">
                          <span className="w-3 h-3 shrink-0 rounded-full bg-primary mt-1 shadow-[0_0_0_4px_white] z-10 group-hover:scale-125 transition-transform"></span>
                          <div className="-mt-1 flex-1 min-w-0">
                            <time className="text-xs font-medium text-neutral-500">{log.date}</time>
                            <div className="flex items-start justify-between gap-2 mt-1">
                              <div>
                                <h3 className="text-[14px] font-bold text-neutral-800">{activityTask?.name || 'چالاکی نەناسراو'}</h3>
                                {log.notes && (
                                  <p className="mt-1 text-[12px] sm:text-sm text-neutral-600">
                                    {log.notes}
                                  </p>
                                )}
                              </div>
                              <div className="shrink-0 flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                  <Icon icon="hugeicons:star" width={14} />
                                  +{log.totalPoints}
                                </span>
                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLogToDelete(log);
                                    }}
                                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-rose-500 rounded-lg transition-all"
                                    title="سڕینەوەی چالاکی"
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold" width={15} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    {userLogs.length > 10 && (
                      <li className="relative flex items-center gap-4 text-center justify-center pt-4 pb-2">
                        <p className="text-[12px] sm:text-sm text-neutral-400 font-medium">
                          تەنیا ١٠ کاری کۆتایی پیشان دراون
                        </p>
                      </li>
                    )}
                  </ol>
                )}
              </div>
            </div>

          </div>
        </div>


        {/* Receipt Modal */}
        <AnimatePresence>
          {receiptLog && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setReceiptLog(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full overflow-hidden border border-neutral-100 relative"
              >
                {/* Decorative top receipt edge */}
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-neutral-100 to-white flex justify-around">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-b-full bg-white shadow-sm mt-[-4px]"></div>
                  ))}
                </div>

                <div className="p-8 pt-10 text-center relative">
                  <button 
                    onClick={() => setReceiptLog(null)}
                    className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="hugeicons:cancel-01" width={18} />
                  </button>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <Icon icon="hugeicons:task-done-01" width={32} />
                  </div>
                  
                  <h3 className="text-[14px] font-extrabold text-neutral-800 mb-1">وەسڵی چالاکی</h3>
                  <p className="text-[12px] sm:text-sm text-neutral-500 font-medium">{receiptLog.date}</p>
                  
                  <div className="border-t border-dashed border-neutral-200 my-6"></div>
                  
                  <div className="space-y-4 text-right">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold mb-1">ناوی چالاکی</p>
                      <p className="font-bold text-neutral-800">{activities.find(a => a.id === receiptLog.taskId)?.name || 'نەناسراو'}</p>
                    </div>
                    
                    {receiptLog.quantity && (
                      <div>
                        <p className="text-xs text-neutral-400 font-bold mb-1">بڕی ئەنجامدراو</p>
                        <p className="font-bold text-neutral-800">{receiptLog.quantity}</p>
                      </div>
                    )}
                    
                    {receiptLog.notes && (
                      <div>
                        <p className="text-xs text-neutral-400 font-bold mb-1">تێبینییەکان</p>
                        <p className="text-[12px] sm:text-sm text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">{receiptLog.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-dashed border-neutral-200 my-6"></div>
                  
                  <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <span className="font-bold text-emerald-800">کۆی خاڵەکان</span>
                    <span className="text-2xl font-black text-emerald-600">+{receiptLog.totalPoints}</span>
                  </div>

                  {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-dashed border-neutral-200">
                      <button
                        onClick={() => {
                          const target = receiptLog;
                          setReceiptLog(null);
                          setLogToDelete(target);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-200"
                      >
                        <Icon icon="solar:trash-bin-trash-bold" width={16} />
                        <span>سڕینەوەی ئەم چالاکییە (سەرپەرشتیاری گشتی)</span>
                      </button>
                    </div>
                  )}
                  
                </div>
                
                {/* Decorative bottom receipt edge */}
                <div className="h-4 bg-gradient-to-t from-neutral-100 to-white flex justify-around relative overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-t-full bg-white shadow-sm mb-[-4px] absolute bottom-0" style={{ left: `${(i * 100) / 20}%` }}></div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Badge Details Modal */}
        <AnimatePresence>
          {viewBadgeDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setViewBadgeDetails(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface-paper rounded-[32px] shadow-2xl max-w-sm w-full p-8 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`w-24 h-24 mx-auto rounded-full ${viewBadgeDetails.bg} ${viewBadgeDetails.color} flex items-center justify-center mb-6 shadow-sm border border-white/50`}>
                  <Icon icon={viewBadgeDetails.icon} width={56} />
                </div>
                <h3 className="text-[14px] font-bold text-neutral-900 mb-2">{viewBadgeDetails.label}</h3>
                <p className="text-neutral-500 mb-6">{viewBadgeDetails.desc}</p>
                
                {viewBadgeDetails.date && (
                  <div className="bg-neutral-50 rounded-2xl p-4 mb-8">
                    <p className="text-xs text-neutral-400 font-medium mb-1">بەرواری بەدەستهێنان</p>
                    <p className="text-[12px] sm:text-sm font-bold text-neutral-700">{viewBadgeDetails.date}</p>
                  </div>
                )}
                
                <button
                  onClick={() => setViewBadgeDetails(null)}
                  className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-4 rounded-[20px] transition-colors"
                >
                  داخستن
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Award Badge Modal */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setShowBadgeModal(false)}>
            <div className="bg-surface-paper rounded-[32px] shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] flex flex-col transform scale-100" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center text-primary text-2xl">
                  <Icon icon="fluent-emoji:sports-medal" />
                </div>
                <div>
                  <h3 className="text-[14px] md:text-xl font-bold text-neutral-900">پێدانی دەستکەوت</h3>
                  <p className="text-[12px] sm:text-sm text-neutral-500 mt-0.5">بە {selectedUser.name}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {customBadges.filter(b => !b.id.startsWith('milestone_')).map((info) => {
                  const key = info.id;
                  return (
                    <label key={key} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedBadge === key ? 'border-primary bg-primary/5 shadow-sm' : 'border-surface-border hover:border-neutral-300 hover:bg-surface-bg'}`}>
                      <input 
                        type="radio" 
                        name="badge" 
                        value={key} 
                        checked={selectedBadge === key}
                        onChange={() => setSelectedBadge(key)}
                        className="hidden"
                      />
                      <div className={`${info.bg} ${info.color} w-14 h-14 rounded-full shrink-0 flex items-center justify-center shadow-sm`}>
                        <Icon icon={info.icon} width={28} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-neutral-900 text-[12px] sm:text-base">{info.label}</p>
                        <p className="text-xs text-neutral-500 mt-1 font-medium leading-relaxed">{info.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedBadge === key ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>
                        {selectedBadge === key && <Icon icon="hugeicons:tick-01" width={16} />}
                      </div>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex gap-3 mt-auto shrink-0">
                <button 
                  onClick={() => setShowBadgeModal(false)}
                  className="flex-1 py-3.5 bg-neutral-100 text-neutral-700 rounded-full font-bold hover:bg-neutral-200 transition-colors text-sm"
                >
                  پاشگەزبوونەوە
                </button>
                <button 
                  onClick={handleAwardBadge}
                  className="flex-1 py-3.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg text-[12px] sm:text-sm"
                >
                  پێدان
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Confirmation Modal for Admin */}
        {logToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-100 text-right space-y-5" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <Icon icon="solar:danger-triangle-bold" width={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">سڕینەوەی ئەم چالاکییە</h3>
                  <p className="text-xs text-neutral-500">سەرپەرشتیاری گشتی (Admin)</p>
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">چالاکی:</span>
                  <span className="font-bold text-neutral-800">
                    {activities.find(a => a.id === logToDelete.taskId)?.name || 'نەناسراو'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">ئەندام:</span>
                  <span className="font-semibold text-neutral-800">
                    {selectedUser.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500 text-xs">ڕێکەوت:</span>
                  <span className="text-neutral-700">{logToDelete.date}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200/60">
                  <span className="text-rose-700 text-xs font-bold">کەمکردنەوەی خاڵ:</span>
                  <span className="font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    -{logToDelete.totalPoints} خاڵ
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-900 leading-relaxed bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                ئاگاداری: ئەم چالاکییە بە تەواوی دەسڕێتەوە و دەستبەجێ خاڵەکان لە ئەندامەکە کەم دەکرێتەوە، هەروەها نۆتیفیکەیشنێکی فەرمی ئاگادارکردنەوەی بۆ دەنێردرێت.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  disabled={isDeletingLog}
                  onClick={async () => {
                    try {
                      setIsDeletingLog(true);
                      await deleteActivityLog(logToDelete.id);
                      setLogToDelete(null);
                    } catch (err: any) {
                      alert(err?.message || 'هەڵەیەک ڕوویدا لە کاتی سڕینەوە');
                    } finally {
                      setIsDeletingLog(false);
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeletingLog ? (
                    <Icon icon="line-md:loading-loop" width={18} />
                  ) : (
                    <>
                      <Icon icon="solar:trash-bin-trash-bold" width={18} />
                      <span>بەڵێ، چالاکییەکە بسڕەوە</span>
                    </>
                  )}
                </button>
                <button
                  disabled={isDeletingLog}
                  onClick={() => setLogToDelete(null)}
                  className="py-3 px-5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm transition-colors"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[14px] md:text-2xl font-bold text-neutral-800">پڕۆفایلی ئەندامان</h2>
          <p className="text-[12px] text-neutral-500 mt-1">لێرەوە دەتوانیت پڕۆفایل و چالاکی سەرجەم ئەندامان ببینی.</p>
        </div>
      </div>

      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Icon icon="mynaui:search" width={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="گەڕان بەدوای ناو یان دەستە..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-neutral-800 text-[12px]"
            />
          </div>
          <div className="flex bg-surface-bg border border-surface-border rounded-[20px] p-1 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid-small')}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                viewMode !== 'list'
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
        <div className="flex flex-wrap gap-3">
          <select 
            value={filterDept} 
            onChange={e => setFilterDept(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-xl px-4 py-2 text-[12px] sm:text-sm focus:outline-none focus:border-primary text-neutral-700 cursor-pointer"
          >
            <option value="all">هەموو دەستەکان</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-xl px-4 py-2 text-[12px] sm:text-sm focus:outline-none focus:border-primary text-neutral-700 cursor-pointer"
          >
            <option value="all">هەموو پلەکان</option>
            <option value="Admin">سەرپەرشتیاری گشتی</option>
            <option value="AssistantAdmin">یاریدەدەری سەرپەرشتیار</option>
            <option value="DepartmentRep">نوێنەری بەش</option>
            <option value="Supervisor">سەرپەرشتیاری دەستە</option>
            <option value="Member">ئەندام</option>
          </select>
        </div>
      </div>

      <div className={viewMode === 'list' ? "grid gap-4 grid-cols-1" : ""}>
        {viewMode === 'list' ? filteredUsers.map(user => {
          const dept = departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || "");
          const role = getRoleName((user.roles?.[0] || "Member"));
          
          return (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className="bg-surface-paper rounded-[24px] shadow-sm border border-surface-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-5 group"
            >
              <div className="relative">
                <div className="p-[3px] rounded-full inline-block shadow-sm" style={getGradientStyle(user.departments)}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shrink-0" />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-light to-primary-light/50 text-primary-dark rounded-full flex items-center justify-center font-bold text-xl border-2 border-white shrink-0 group-hover:scale-105 transition-transform">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[12px] font-bold border-2 border-white shadow-sm flex items-center gap-0.5">
                  {user.points} <Icon icon="fluent-emoji:star" width={10} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-[14px] font-extrabold text-neutral-800 sm:text-lg truncate group-hover:text-primary transition-colors">{user.name}</h3>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[12px] sm:text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">{role}</span>
                  <span className="text-[12px] sm:text-xs font-medium text-neutral-500 truncate">{dept}</span>
                </div>
                {user.jobTitle && <p className="text-[12px] sm:text-xs text-indigo-500 font-medium truncate mt-1">{user.jobTitle}</p>}
              </div>
              
              <div className="hidden sm:flex gap-1.5 items-center shrink-0">
                {(!user.badges || user.badges.length === 0) ? (
                  <span className="text-xs text-neutral-400 font-medium mr-4">بێ دەستکەوت</span>
                ) : (
                  <>
                    {user.badges.slice(0, 3).map((b, idx) => {
                      const info = getBadgeDetails(b.type, customBadges);
                      if (!info) return null;
                      return (
                        <div key={idx} className={`${info.bg} ${info.color} w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-white/50`} title={info.label}>
                          <Icon icon={info.icon} width={20} />
                        </div>
                      );
                    })}
                    {(user.badges.length) > 3 && (
                      <div className="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center text-xs font-bold border border-surface-border">
                        +{(user.badges.length) - 3}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="text-neutral-300 group-hover:text-primary transition-colors mr-2">
                <Icon icon="hugeicons:arrow-left-01" width={20} />
              </div>
            </div>
          );
        }) : (
          <ChromaGrid 
            items={filteredUsers.map(user => ({
              image: user.avatar || "",
              title: user.name,
              subtitle: departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || ""),
              handle: getRoleName((user.roles?.[0] || "Member")),
              borderColor: departments.find(d => d.id === (user.departments?.[0] || ""))?.color || '#a8c8dc',
              gradient: getGradientStyle(user.departments).background,
              points: user.points,
              badges: user.badges,
              onClick: () => setSelectedUser(user)
            }))}
          />
        )}
      </div>
    </div>
  );
}
