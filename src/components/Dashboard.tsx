import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';
import { getTimeAgoKurdish } from '../lib/dateUtils';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineWidget } from './TimelineWidget';
import { WorkflowTasks } from './WorkflowTasks';
import { OnboardingModal } from './OnboardingModal';
import { MILESTONES, getBadgeDetails } from '../lib/badges';

export function Dashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const { currentUser, users, logs, departments, activities, customBadges, setViewProfileId } = useAppContext();

  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [dismissedComments, setDismissedComments] = useState<string[]>([]);
  const [viewBadgeDetails, setViewBadgeDetails] = useState<any>(null);
  const [showWorkflowTasks, setShowWorkflowTasks] = useState(false);
  const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🎉', '🔥'];

  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setRecentComments(data);
    });
    return () => unsubscribe();
  }, []);


  const handleVote = async (e: React.MouseEvent, commentId: string, optionId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    const comment = recentComments.find(c => c.id === commentId);
    if (!comment || !comment.poll) return;

    const newOptions = comment.poll.options.map(opt => {
      let votes = opt.votes.filter(id => id !== currentUser.id);
      if (opt.id === optionId) {
        votes.push(currentUser.id);
      }
      return { ...opt, votes };
    });

    try {
      await updateDoc(commentRef, {
        'poll.options': newOptions
      });
    } catch (error) {
      console.error('Error voting from dashboard: ', error);
    }
  };

  const handleReaction = async (e: React.MouseEvent, commentId: string, emoji: string, currentReactions: Record<string, string[]> = {}, likes: string[] = []) => {
    e.stopPropagation();
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    
    const newReactions = { ...currentReactions };
    
    if (likes.length > 0) {
      if (!newReactions['❤️']) newReactions['❤️'] = [];
      likes.forEach(userId => {
        if (!newReactions['❤️'].includes(userId)) {
          newReactions['❤️'].push(userId);
        }
      });
      await updateDoc(commentRef, { likes: [], reactions: newReactions });
    }
    
    const userReacted = (newReactions[emoji] || []).includes(currentUser.id);
    
    if (userReacted) {
      newReactions[emoji] = newReactions[emoji].filter(id => id !== currentUser.id);
      if (newReactions[emoji].length === 0) {
        delete newReactions[emoji];
      }
    } else {
      if (!newReactions[emoji]) {
        newReactions[emoji] = [];
      }
      newReactions[emoji].push(currentUser.id);
    }
    
    await updateDoc(commentRef, { reactions: newReactions });
    setShowReactionsFor(null);
  };

  if (!currentUser) return null;

  const userLogs = logs.filter(l => l.userId === currentUser.id);
  const pendingLogs = userLogs.filter(l => l.status === 'Pending').length;
  const approvedLogs = userLogs.filter(l => l.status === 'Approved').length;

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const userRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;
  const isGeneralSupervisor = currentUser.roles.includes('Admin');
  const displayPoints = currentUser.points || 0;
  const displayRank = isGeneralSupervisor ? '-' : `#${userRank}`;
  const displayPending = pendingLogs;
  const displayApproved = approvedLogs;

  // Chart data (mocked slightly for visual effect)
  const chartData = [
    { name: 'هەفتەی ١', points: Math.floor(displayPoints * 0.2) },
    { name: 'هەفتەی ٢', points: Math.floor(displayPoints * 0.3) },
    { name: 'هەفتەی ٣', points: Math.floor(displayPoints * 0.1) },
    { name: 'هەفتەی ٤', points: Math.floor(displayPoints * 0.4) },
  ];

  return (
    <div className="space-y-6">
      <OnboardingModal />

      
      {/* Stacked Psychosphere Comments */}
      {recentComments.length > 0 && (
        <div className="relative w-full h-[320px] mb-8">
          <AnimatePresence>
            {recentComments.filter(c => !dismissedComments.includes(c.id)).slice(0, 3).map((comment, index) => {
              const author = users.find(u => u.id === comment.userId);
              const likes = comment.likes || [];
              const replyCount = comment.replies?.length || 0;
              const isTop = index === 0;
              
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: 1 - (index * 0.2), 
                    y: index * 15, 
                    scale: 1 - (index * 0.05),
                    zIndex: 10 - index
                  }}
                  exit={{ opacity: 0, x: -200, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 w-full"
                >
                  <div 
                    onClick={() => {
                      if (isTop && onNavigate) onNavigate('public-comments');
                    }}
                    className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] p-6 md:p-8 shadow-custom relative overflow-hidden flex flex-col h-[280px] ${isTop ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'pointer-events-none'}`}
                  >
                    {isTop && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDismissedComments(prev => [...prev, comment.id]);
                        }}
                        className="absolute top-4 left-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-20"
                      >
                        <Icon icon="hugeicons:cancel-01" width={18} />
                      </button>
                    )}
                    
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                    
                    
                    <div className="relative z-10 flex items-center gap-3 mb-4">
                      <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(author?.id || null); onNavigate('profiles'); }}>
                      {author?.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 backdrop-blur-sm">
                          {author?.name.charAt(0) || '?'}
                        </div>
                      )}
                      </div>
                      <div className="min-w-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(author?.id || null); onNavigate('profiles'); }}>
                        <h4 className="text-[14px] font-bold text-white truncate hover:underline">{author?.name || 'نەناسراو'}</h4>

                        <div className="flex items-center gap-1.5 text-[10px] text-blue-100 opacity-90">
                          <Icon icon="fluent-emoji:speech-balloon" width={14} />
                          <span>دیوەخانی سایکۆفێر</span>
                          <span>•</span>
                          <span dir="rtl">{getTimeAgoKurdish(comment.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {comment.content && (
                      <p className={`text-white/90 text-[12px] md:text-xs leading-relaxed whitespace-pre-wrap relative z-10 ${comment.poll ? 'line-clamp-2 mb-2 flex-none' : 'line-clamp-3 mb-auto flex-1'}`}>
                        {comment.content}
                      </p>
                    )}
                    
                    {comment.poll && (
                      <div className="relative z-10 bg-white/10 border border-white/20 rounded-[16px] p-3 mb-auto flex-1 overflow-y-auto custom-scrollbar min-h-[100px]">
                        <h4 className="font-bold text-xs md:text-sm mb-2 text-white">{comment.poll.question}</h4>
                        <div className="space-y-1.5">
                          {(() => {
                            const totalVotes = comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                            const userVotedId = comment.poll.options.find(o => o.votes.includes(currentUser?.id || ''))?.id;
                            
                            return comment.poll.options.map((opt) => {
                              const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                              const isSelected = opt.id === userVotedId;
                              
                              if (userVotedId) {
                                return (
                                  <div key={opt.id} className="relative overflow-hidden rounded-[8px] border border-white/20 bg-black/20 p-2 cursor-pointer group" onClick={(e) => handleVote(e, comment.id, opt.id)}>
                                    <div className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${isSelected ? 'bg-white/30' : 'bg-white/10'}`} style={{ width: `${pct}%` }}></div>
                                    <div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs">
                                      <span className={`font-medium flex items-center gap-1.5 ${isSelected ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}`}>
                                        {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[14px]" />}
                                        <span className="truncate max-w-[120px]">{opt.text}</span>
                                      </span>
                                      <span className="text-white/80 font-bold">{pct}%</span>
                                    </div>
                                    {opt.votes.length > 0 && (
                                      <div className="relative z-10 flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-white/10">
                                        {opt.votes.map(voterId => {
                                          const voter = users.find(u => u.id === voterId);
                                          if (!voter) return null;
                                          return (
                                            <div key={voterId} className="flex items-center gap-1 bg-black/20 px-1 py-0.5 rounded text-[9px] border border-white/5" title={voter.name}>
                                              {voter.avatar ? <img src={voter.avatar} className="w-3 h-3 rounded-full object-cover"/> : <div className="w-3 h-3 bg-white/20 text-white rounded-full flex items-center justify-center text-[7px] font-bold">{voter.name.charAt(0)}</div>}
                                              <span className="text-white/80 truncate max-w-[40px] font-medium">{voter.name.split(' ')[0]}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              } else {
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={(e) => handleVote(e, comment.id, opt.id)}
                                    className="w-full text-right p-2 rounded-[8px] border border-white/20 hover:bg-white/10 transition-colors text-[10px] sm:text-xs font-medium text-white/80 hover:text-white truncate"
                                  >
                                    {opt.text}
                                  </button>
                                );
                              }
                            });
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {isTop && (
                      <div className="flex items-center gap-3 pt-3 mt-2 border-t border-white/10 relative z-10">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                          <Icon icon="fluent:heart-24-filled" width={16} />
                          {(likes.length || 0) + Object.values(comment.reactions || {}).flat().length} ڕیاکت
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                          <Icon icon="fluent:comment-24-regular" width={16} />
                          {replyCount} کۆمێنت
                        </div>
                        <div className="mr-auto text-xs font-bold text-white/90 flex items-center gap-1">
                          لێی بدە بۆ بینین
                          <Icon icon="oui:arrow-left" width={12} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {recentComments.filter(c => !dismissedComments.includes(c.id)).length === 0 && (
             <div className="bg-surface-paper border border-dashed border-surface-border rounded-[24px] h-[280px] flex flex-col items-center justify-center text-neutral-500">
               <Icon icon="fluent-emoji:ghost" width={48} className="mb-3 opacity-50" />
               <p>هیچ نامەیەکی نوێ نییە لە دیوەخان</p>
               <button 
                 onClick={() => setDismissedComments([])}
                 className="mt-4 text-sm text-primary font-bold hover:underline"
               >
                 گەڕاندنەوەی نامەکان
               </button>
             </div>
          )}
        </div>
      )}
      

      {/* Action Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
        {/* Add Activity Button (Right in RTL) */}
        <button 
          onClick={() => { if (onNavigate) onNavigate('add-activity'); }}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-primary rounded-[20px] shadow-custom hover:shadow-lg transition-all group overflow-hidden relative text-white"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
              <Icon icon="hugeicons:plus-sign" width={20} />
            </div>
            <div className="text-right">
              <h3 className="text-[14px] sm:text-base font-bold text-white">تۆمارکردن</h3>
              <p className="text-[10px] text-white truncate max-w-[80px] sm:max-w-none">زیادکردنی چالاکی نوێ</p>
            </div>
          </div>
        </button>

        {/* Process Timeline (Left in RTL) */}
        <button
          onClick={() => setShowWorkflowTasks(true)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-[20px] shadow-custom hover:shadow-lg transition-all group overflow-hidden relative text-white"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
              <Icon icon="solar:round-transfer-bold-duotone" width={20} />
            </div>
            <div className="text-right">
              <h3 className="text-[14px] sm:text-base font-bold text-white">ڕاسپاردەکان</h3>
              <p className="text-[10px] text-white truncate max-w-[80px] sm:max-w-none">بینین و بەڕێوەبردن</p>
            </div>
          </div>
        </button>
      </div>

      {/* App Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-surface-paper p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] sm:text-sm text-neutral-500 mb-0.5">کۆی ئەندامان</p>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">{users.length}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:busts-in-silhouette" className="text-[16px] sm:text-[20px]" />
          </div>
        </div>
        <div className="bg-surface-paper p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] sm:text-sm text-neutral-500 mb-0.5">دەستەکانی کارکردن</p>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">{departments.length}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:handshake" className="text-[16px] sm:text-[20px]" />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4">
        <div className="bg-surface-paper p-1.5 sm:p-6 pb-2 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[88px]">
          <div className="relative z-10 w-6 h-6 sm:w-12 sm:h-12 mt-1 mb-1 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:sports-medal" className="text-xs sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[12px] sm:text-sm font-medium mb-0 truncate w-full">خاڵەکان</p>
            <h3 className="text-[14px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{displayPoints}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:sports-medal" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
        
        <div className="bg-surface-paper p-1.5 sm:p-6 pb-2 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[88px]">
          <div className="relative z-10 w-6 h-6 sm:w-12 sm:h-12 mt-1 mb-1 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:trophy" className="text-xs sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[12px] sm:text-sm font-medium mb-0 truncate w-full">ئاست</p>
            <h3 className="text-[14px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{displayRank}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:trophy" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="bg-surface-paper p-1.5 sm:p-6 pb-2 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[88px]">
          <div className="relative z-10 w-6 h-6 sm:w-12 sm:h-12 mt-1 mb-1 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:chart-increasing" className="text-xs sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[12px] sm:text-sm font-medium mb-0 truncate w-full">چالاکی</p>
            <h3 className="text-[14px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{userLogs.length}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:chart-increasing" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

      </div>

      {/* Gamification Progress */}
      <div className="bg-white p-6 rounded-[24px] border border-surface-border shadow-custom">
        <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:target" width={24} />
          ئامانجی داهاتوو
        </h3>
        
        {(() => {
          const nextMilestoneObj = MILESTONES.find(m => displayPoints < m.threshold);
          
          if (!nextMilestoneObj) {
            return (
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 rounded-[20px] border border-emerald-200">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 border border-emerald-300">
                  <Icon icon="fluent-emoji:crown" width={40} />
                </div>
                <div>
                  <h4 className="text-[15px] font-bold">تۆ گەیشتوویت بە بەرزترین ئاست!</h4>
                  <p className="text-[12px] sm:text-sm text-emerald-700/90">هەموو نیشانە سەرەکییەکانی سیستەمت بە سەرکەوتوویی بەدەستهێناوە.</p>
                </div>
              </div>
            );
          }

          const nextMilestone = nextMilestoneObj.threshold;
          const milestoneLabel = nextMilestoneObj.label;
          const milestoneIcon = nextMilestoneObj.icon;
          
          const currentMilestoneIndex = MILESTONES.indexOf(nextMilestoneObj);
          const prevThreshold = currentMilestoneIndex > 0 ? MILESTONES[currentMilestoneIndex - 1].threshold : 0;
          
          const progressPercent = Math.min(100, Math.max(0, Math.round(((displayPoints - prevThreshold) / (nextMilestone - prevThreshold)) * 100)));
          const remainingPoints = Math.max(0, nextMilestone - displayPoints);

          return (
            <div className="bg-white p-6 rounded-[20px] border border-surface-border relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-50 p-2.5 rounded-full shadow-sm border border-neutral-100">
                    <Icon icon={milestoneIcon} width={34} />
                  </div>
                  <div>
                    <h4 className="text-[14px] sm:text-base font-bold text-neutral-800">بەدەستهێنانی نیشانەی {milestoneLabel}</h4>
                    <p className="text-[12px] sm:text-sm text-neutral-500">
                      پێویستت بە <strong className="text-primary font-bold">{remainingPoints}</strong> خاڵی ترە بۆ ئەم ئامانجە ({displayPoints} / {nextMilestone} خاڵ).
                    </p>
                  </div>
                </div>
                <div className="font-bold text-xl sm:text-2xl text-primary">{progressPercent}%</div>
              </div>
              
              <div className="w-full bg-neutral-100 rounded-full h-3.5 shadow-inner relative z-10 overflow-hidden mb-4">
                <div 
                  className="bg-primary h-3.5 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-1.5" 
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Milestones Steps Row */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-neutral-100 relative z-10">
                {MILESTONES.slice(0, 4).map((m) => {
                  const achieved = displayPoints >= m.threshold;
                  return (
                    <div key={m.id} className={`flex flex-col items-center p-2 rounded-xl text-center border transition-all ${achieved ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-neutral-50 border-neutral-100 text-neutral-400'}`}>
                      <Icon icon={m.icon} width={22} className={achieved ? '' : 'grayscale opacity-60'} />
                      <span className="text-[11px] font-bold mt-1">{m.label}</span>
                      <span className="text-[9px] mt-0.5">{achieved ? '✓ بەدەستهات' : `${m.threshold} خاڵ`}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Badges & Rewards */}
      <div className="bg-surface-paper p-4 sm:p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:star-rate-rounded" className="text-[16px] sm:text-[18px]" />
          باج و دەستکەوتەکانت
        </h3>
        {(!currentUser.badges || currentUser.badges.length === 0) ? (
          <div className="text-center py-6 text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border text-[12px] sm:text-sm">
            هێشتا هیچ نیشانەیەکت بەدەست نەهێناوە. بەردەوام بە لە کارەکانت!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {currentUser.badges.map((b, idx) => {
              const info = getBadgeDetails(b.type, customBadges);
              if (!info) return null;
              return (
                <button 
                  key={idx} 
                  onClick={() => setViewBadgeDetails({...info, date: b.dateAwarded || '', note: b.note})}
                  className={`${info.bg} ${info.color} p-1.5 sm:p-2.5 rounded-full flex items-center justify-center border border-white/40 shadow-sm relative overflow-hidden group hover:scale-105 transition-transform`}
                  title={info.label}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                    <Icon icon={info.icon} className="text-[18px] sm:text-[26px]" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommended Quests */}
      <div className="bg-surface-paper p-4 md:p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-[14px] md:text-lg font-bold text-neutral-800 mb-3 md:mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:bullseye" width={20} className="md:w-6 md:h-6" />
          ئەو کارانەی کە دەتوانیت بیانکەیت
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {activities.filter(a => !isGeneralSupervisor && (a.department || "") === (currentUser?.departments?.[0] || "")).slice(0, 4).map(task => (
            <div key={task.id} className="bg-surface-bg p-3 md:p-4 rounded-[20px] border border-surface-border flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group text-[12px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform shrink-0">
                <Icon icon="fluent-emoji:star" width={20} className="md:w-6 md:h-6" />
              </div>
              <div className="-mt-1">
                <h4 className="text-[12px] font-bold text-neutral-800 mb-0.5 leading-tight">{task.name}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[12px] font-bold">
                    +{task.basePoints} خاڵ
                  </span>
                  {<span className="text-[12px] text-neutral-500">جۆری چەندایەتی</span>}
                </div>
              </div>
            </div>
          ))}
          {activities.filter(a => !isGeneralSupervisor && (a.department || "") === (currentUser?.departments?.[0] || "")).length === 0 && (
            <div className="col-span-2 text-center py-6 text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border">
              لە ئێستادا هیچ کارێک نییە بۆ دەستەکەی تۆ.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-custom relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          <h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2 relative z-10">
            <Icon icon="fluent-emoji:chart-increasing" className="text-[18px] sm:text-[24px]" />
            پێشکەوتنەکانت لەم مانگەدا
          </h3>
          <div className="h-72 w-full relative z-10" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#546FFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#546FFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEDF7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 10, fontWeight: 500}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 10, fontWeight: 500}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', padding: '12px'}} 
                  cursor={{stroke: '#DCE4FF', strokeWidth: 2, strokeDasharray: '4 4'}}
                />
                <Area type="monotone" dataKey="points" stroke="#546FFF" strokeWidth={4} fillOpacity={1} fill="url(#colorPoints)" activeDot={{ r: 6, fill: '#546FFF', stroke: '#fff', strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leaderboard Snippet */}
        <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-custom relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="fluent-emoji:glowing-star" className="text-[18px] sm:text-[24px]" />
              پێشەنگەکان (Top)
            </h3>
          </div>
          <div className="space-y-3 relative z-10">
            {sortedUsers.slice(0, 5).map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center gap-3 p-3 rounded-[20px] transition-all hover:-translate-y-1 ${
                  index === 0 ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 shadow-md' :
                  index === 1 ? 'bg-gradient-to-r from-slate-100 to-gray-200 border-2 border-slate-300 shadow-sm' :
                  index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400/60 shadow-sm' :
                  'bg-surface-bg hover:bg-white hover:shadow-sm border border-surface-border/50 hover:border-surface-border'
                }`}
              >
                
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  {index === 0 ? (
                    <Icon icon="fluent-emoji:1st-place-medal" width={32} />
                  ) : index === 1 ? (
                    <Icon icon="fluent-emoji:2nd-place-medal" width={32} />
                  ) : index === 2 ? (
                    <Icon icon="fluent-emoji:3rd-place-medal" width={32} />
                  ) : (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-surface-border flex items-center justify-center text-[12px] sm:text-sm font-bold text-neutral-500 shadow-sm leading-[19px]">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(user.id); onNavigate('profiles'); }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full object-cover shrink-0 ${index < 3 ? 'border-2 border-white shadow-sm' : 'border border-surface-border'}`} />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${index < 3 ? 'border-2 border-white shadow-sm bg-white text-primary' : 'bg-surface-border text-neutral-600'}`}>
                    {user.name.charAt(0)}
                  </div>
                )}
                </div>
                
                <div className="flex-1 min-w-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(user.id); onNavigate('profiles'); }}>
                  <p className={`text-xs font-bold truncate hover:underline ${index === 0 ? 'text-amber-900' : index === 1 ? 'text-slate-800' : index === 2 ? 'text-orange-900' : 'text-neutral-800'}`}>

                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || "")}
                  </p>
                </div>
                
                <div className={`font-bold text-sm px-3 py-1 rounded-full ${
                  index === 0 ? 'bg-white text-amber-700 shadow-sm' : 
                  index === 1 ? 'bg-white text-slate-700 shadow-sm' : 
                  index === 2 ? 'bg-white text-orange-700 shadow-sm' : 
                  'text-primary bg-primary/10'
                }`}>
                  {user.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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

      {/* Workflow Tasks Modal */}
      <AnimatePresence>
        {showWorkflowTasks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowWorkflowTasks(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors shadow-md z-20"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto rounded-[24px] shadow-2xl flex-1 bg-surface-paper">
                <WorkflowTasks />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
