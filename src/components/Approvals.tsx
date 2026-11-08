import React from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';

export function Approvals() {
  const { currentUser, users, logs, updateLogStatus, activities, departments } = useAppContext();

  if (!currentUser || !(currentUser.roles || []).some(r => ['Admin', 'AssistantAdmin', 'Supervisor'].includes(r))) {
    return (
      <div className="p-8 text-center text-neutral-500">
        تۆ دەسەڵاتی چوونە ژوورەوەت نییە بۆ ئەم بەشە.
      </div>
    );
  }

  // If Admin, see all pending. If Supervisor, see pending for their department.
  
  const navigateToProfile = (userId: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { tab: "profiles" } })); setTimeout(() => window.dispatchEvent(new CustomEvent("open-user-profile", { detail: { id: userId } })), 100);;
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };

  const pendingLogs = logs.filter(l => {
    if (l.status !== 'Pending') return false;
    
    // Don't let users approve their own logs (unless admin maybe, but good practice)
    if (l.userId === currentUser.id && !(currentUser.roles || []).includes('Admin')) return false;

    if ((currentUser.roles || []).includes('Admin')) return true;
    
    const task = activities.find(t => t.id === l.taskId);
    return currentUser.departments?.includes(task?.department || '');
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Illustration */}
      <div className="bg-gradient-to-r from-emerald-100 to-teal-50 rounded-[24px] p-8 flex items-center justify-between border border-emerald-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[14px] md:text-2xl font-bold text-emerald-900 mb-2">پەسەندکردنی چالاکییەکان</h2>
          <p className="text-emerald-800/80">ئەو چالاکییانەی چاوەڕێی پەسەندکردنی تۆن.</p>
        </div>
        <div className="relative z-10 hidden md:block">
          <Icon icon="fluent-emoji:check-mark-button" width={80} />
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Icon icon="fluent-emoji:check-mark-button" width={200} />
        </div>
      </div>

      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="space-y-4">
          {pendingLogs.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border flex flex-col items-center justify-center">
              <Icon icon="fluent-emoji:party-popper" width={48} className="mb-4 opacity-50" />
              <p>هیچ چالاکییەک نییە بۆ پەسەندکردن. هەموو شتێک تەواو بووە!</p>
            </div>
          ) : (
          pendingLogs.map(log => {
            const task = activities.find(t => t.id === log.taskId);
            const user = users.find(u => u.id === log.userId);
            const dept = departments.find(d => d.id === task?.department)?.name || task?.department;

            return (
              <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-surface-bg rounded-[20px] border border-surface-border gap-4">
                <div className="flex-1 min-w-0">
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-800 cursor-pointer hover:underline" onClick={() => navigateToProfile(log.userId)}>{user?.name}</span>

                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-[12px] sm:text-sm text-neutral-500">{dept}</span>
                  </div>
                  <h4 className="text-[14px] font-medium text-slate-700">{task?.name}</h4>
                  <div className="text-[12px] sm:text-sm text-neutral-500 mt-1 flex gap-4">
                    <span>چەندییەتی: <strong className="text-slate-700">{log.quantity}</strong></span>
                    <span>کۆی خاڵ: <strong className="text-primary">{log.totalPoints}</strong></span>
                    <span>ڕێکەوت: {log.date}</span>
                  </div>
                  {log.evidence && (
                    <div className="mt-2 text-[12px] sm:text-sm">
                      <span className="text-neutral-500">بەڵگە: </span>
                      <a href={log.evidence.startsWith('http') ? log.evidence : `https://${log.evidence}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        لێی بدە
                      </a>
                    </div>
                  )}
                  {log.notes && (
                    <p className="mt-2 text-[12px] sm:text-sm text-neutral-600 bg-surface-paper p-2 rounded border border-surface-border">
                      تێبینی: {log.notes}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateLogStatus(log.id, 'Approved')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-[20px] font-medium transition-colors"
                  >
                    <Icon icon="hugeicons:checkmark" width={18} />
                    پەسەندکردن
                  </button>
                  <button 
                    onClick={() => updateLogStatus(log.id, 'Rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-[20px] font-medium transition-colors"
                  >
                    <Icon icon="mynaui:x" width={18} />
                    ڕەتکردنەوە
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
  );
}
