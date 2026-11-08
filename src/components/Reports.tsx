import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';

export function Reports() {
  const { currentUser, logs, activities, users, deleteActivityLog } = useAppContext();
  const [filter, setFilter] = useState('All');
  const [logToDelete, setLogToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!currentUser) return null;

  const isAdmin = (currentUser.roles || []).includes('Admin');

  // If Admin/Supervisor, they can see all logs for their department, else just their own.
  // For simplicity here, let's just show own logs, and a tab for department logs if privileged.
  
  const [viewMode, setViewMode] = useState<'Mine' | 'Department' | 'All'>('Mine');
  
  let visibleLogs = logs;
  if (viewMode === 'Mine') {
    visibleLogs = logs.filter(l => l.userId === currentUser.id);
  } else if (viewMode === 'Department') {
    visibleLogs = logs.filter(l => {
      const task = activities.find(t => t.id === l.taskId);
      return task?.department === (currentUser?.departments?.[0] || "");
    });
  } // 'All' shows all logs (for Admin/Asst/Rep)
  
  const displayLogs = filter === 'All' ? visibleLogs : visibleLogs.filter(l => l.status === filter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Illustration */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-50 rounded-[24px] p-8 flex items-center justify-between border border-blue-200 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[14px] md:text-2xl font-bold text-blue-900 mb-2">ڕاپۆرتەکان</h2>
          <p className="text-blue-800/80">مێژووی هەموو ئەو کارانەی کە تا ئێستا کردووتە لێرە بیبینە.</p>
        </div>
        <div className="relative z-10 hidden md:block">
          <Icon icon="fluent-emoji:bar-chart" width={80} />
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Icon icon="fluent-emoji:bar-chart" width={200} />
        </div>
      </div>

      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-1 sm:gap-2 bg-surface-bg p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            <button onClick={() => setViewMode('Mine')} className={`flex-1 md:flex-none px-2 sm:px-4 py-2 rounded-lg text-[12px] sm:text-sm font-medium whitespace-nowrap transition-colors ${viewMode === 'Mine' ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}>کارەکانی خۆم</button>
            {(currentUser.roles || []).some(r => ['Supervisor', 'DepartmentRep', 'AssistantAdmin', 'Admin'].includes(r)) && (
              <button onClick={() => setViewMode('Department')} className={`flex-1 md:flex-none px-2 sm:px-4 py-2 rounded-lg text-[12px] sm:text-sm font-medium whitespace-nowrap transition-colors ${viewMode === 'Department' ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}>دەستەکەی من</button>
            )}
            {(currentUser.roles || []).some(r => ['DepartmentRep', 'AssistantAdmin', 'Admin'].includes(r)) && (
              <button onClick={() => setViewMode('All')} className={`flex-1 md:flex-none px-2 sm:px-4 py-2 rounded-lg text-[12px] sm:text-sm font-medium whitespace-nowrap transition-colors ${viewMode === 'All' ? 'bg-white shadow-sm text-neutral-800' : 'text-neutral-500 hover:text-neutral-700'}`}>هەموو دەستەکان</button>
            )}
          </div>
        
        <div className="flex flex-wrap gap-1 bg-surface-border p-1 rounded-[20px] self-start w-full md:w-auto">
          {['All', 'Approved', 'Pending', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 sm:px-4 py-1.5 rounded-md text-[12px] sm:text-sm font-medium transition-colors flex-1 text-center ${
                filter === f 
                  ? 'bg-surface-paper text-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.02)]' 
                  : 'text-neutral-500 hover:text-slate-700'
              }`}
            >
              {f === 'All' ? 'هەمووی' : 
               f === 'Approved' ? 'پەسەندکراو' : 
               f === 'Pending' ? 'لە چاوەڕوانیدا' : 'ڕەتکراوە'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-surface-border text-neutral-500 text-sm">
              <th className="py-3 px-4 font-medium">چالاکی</th>
              <th className="py-3 px-4 font-medium">ڕێکەوت</th>
              <th className="py-3 px-4 font-medium text-center">چەندییەتی</th>
              <th className="py-3 px-4 font-medium text-center">خاڵ</th>
              <th className="py-3 px-4 font-medium">باری پەسەندکردن</th>
              {viewMode !== 'Mine' && <th className="py-3 px-4 font-medium">بەکارهێنەر</th>}
              {isAdmin && <th className="py-3 px-4 font-medium text-center">کردار</th>}
            </tr>
          </thead>
          <tbody>
            {displayLogs.length === 0 ? (
              <tr>
                <td colSpan={(viewMode !== 'Mine' ? 6 : 5) + (isAdmin ? 1 : 0)} className="py-12 text-center text-neutral-500">
                  <div className="flex flex-col items-center justify-center">
                    <Icon icon="fluent-emoji:magnifying-glass-tilted-left" width={48} className="mb-4 opacity-50" />
                    <p>ببورە، هیچ کارێک نەدۆزرایەوە.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayLogs.map(log => {
                const task = activities.find(t => t.id === log.taskId);
                return (
                  <tr key={log.id} className="border-b border-surface-border hover:bg-surface-bg transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-800">{task?.name || 'نەزانراو'}</div>
                      {log.notes && <div className="text-xs text-neutral-500 mt-0.5 max-w-xs truncate">{log.notes}</div>}
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-600">{log.date}</td>
                    <td className="py-3 px-4 text-center text-neutral-800 font-medium">{log.quantity}</td>
                    <td className="py-3 px-4 text-center text-neutral-800 font-bold">{log.totalPoints}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        log.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {log.status === 'Approved' ? 'پەسەندکراو' :
                         log.status === 'Pending' ? 'چاوەڕێ' : 'ڕەتکراوە'}
                      </span>
                    </td>
                    {viewMode !== 'Mine' && (
                      <td className="py-3 px-4 text-sm text-neutral-600 font-medium cursor-pointer hover:underline" onClick={() => { window.dispatchEvent(new CustomEvent("navigate", { detail: { tab: "profiles" } })); setTimeout(() => window.dispatchEvent(new CustomEvent("open-user-profile", { detail: { id: log.userId } })), 100); }}>
                        {users.find(u => u.id === log.userId)?.name || 'نەناسراو'}
                      </td>
                    )}
                    {isAdmin && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setLogToDelete(log)}
                          className="inline-flex items-center justify-center p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-all"
                          title="سڕینەوەی ئەم چالاکییە"
                        >
                          <Icon icon="solar:trash-bin-trash-bold" width={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

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
                  {users.find(u => u.id === logToDelete.userId)?.name || 'نەناسراو'}
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
              ئاگاداری: ئەم چالاکییە دەسڕێتەوە و دەستبەجێ خاڵەکان لەم ئەندامە کەم دەکرێتەوە، هەروەها نۆتیفیکەیشنێکی ئاگادارکردنەوەی فەرمی بۆ ئەندامەکە دەنێردرێت.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await deleteActivityLog(logToDelete.id);
                    setLogToDelete(null);
                  } catch (err: any) {
                    alert(err?.message || 'هەڵەیەک ڕوویدا لە کاتی سڕینەوە');
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? (
                  <Icon icon="line-md:loading-loop" width={18} />
                ) : (
                  <>
                    <Icon icon="solar:trash-bin-trash-bold" width={18} />
                    <span>بەڵێ، چالاکییەکە بسڕەوە</span>
                  </>
                )}
              </button>
              <button
                disabled={isDeleting}
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
  </div>
  );
}
