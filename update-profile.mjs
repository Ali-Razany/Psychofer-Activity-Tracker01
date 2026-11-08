import fs from 'fs';

let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const importRegex = /import \{([^}]+)\} from 'lucide-react';/;
code = code.replace(importRegex, (match, p1) => {
  return `import {${p1}, ArrowRight} from 'lucide-react';`;
});

const startTarget = `    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedUser(null)} className="text-blue-600 hover:underline mb-4">
          &rarr; گەڕانەوە بۆ لیستی ئەندامان
        </button>`;

const endTarget = `        )}
      </div>
    );
  }`;

const startIndex = code.indexOf(startTarget);
const endIndex = code.indexOf(endTarget) + endTarget.length;

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find boundaries");
  process.exit(1);
}

const newReturn = `    return (
      <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar rtl" dir="rtl">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="bg-slate-900 rounded-xl p-6 md:p-8 mb-6 relative overflow-hidden shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl border-2 border-white/20 shadow-sm shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                  <p className="text-white/80 mt-1">
                    {getRoleName(selectedUser.role)} • {departments.find(d => d.id === selectedUser.department)?.name || selectedUser.department}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {canAwardBadge && (
                  <button 
                    onClick={() => setShowBadgeModal(true)}
                    className="bg-white/10 text-white hover:bg-white/20 border-0 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    پێدانی نیشانە
                  </button>
                )}
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="bg-white text-slate-900 hover:bg-slate-100 border-0 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={16} />
                  گەڕانەوە
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">زانیارییەکانی ئەندام</h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-sm font-normal text-slate-500">ناو:</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-normal text-slate-500">پلە:</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{getRoleName(selectedUser.role)}</p>
                </div>
                <div>
                  <label className="text-sm font-normal text-slate-500">بەش:</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{departments.find(d => d.id === selectedUser.department)?.name || selectedUser.department}</p>
                </div>
                <div>
                  <label className="text-sm font-normal text-slate-500">ئیمەیڵ:</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{selectedUser.email || 'تۆمارنەکراوە'}</p>
                </div>
                <div>
                  <label className="text-sm font-normal text-slate-500">کۆی خاڵەکان:</label>
                  <p className="text-sm text-amber-600 mt-1 font-bold">{selectedUser.points} خاڵ</p>
                </div>
                <div>
                  <label className="text-sm font-normal text-slate-500">کۆی چالاکییەکان:</label>
                  <p className="text-sm text-blue-600 mt-1 font-bold">{userLogs.length} چالاکی</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">نیشانە و خەڵاتەکان</h3>
              </div>
              <div className="p-5">
                {(!selectedUser.badges || selectedUser.badges.length === 0) ? (
                  <div className="text-center py-8">
                    <Award size={48} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-500 text-sm">هێشتا هیچ نیشانەیەکی وەرنەگرتووە.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedUser.badges.map((b, idx) => {
                      const info = BADGE_INFO[b.type];
                      if (!info) return null;
                      const Icon = info.icon;
                      return (
                        <div key={idx} className={\`\${info.bg} \${info.color} px-4 py-3 rounded-lg flex items-center gap-3 border border-white/20 shadow-sm\`}>
                          <Icon size={20} className="shrink-0" />
                          <div className="flex-1">
                            <p className="font-bold text-sm">{info.label}</p>
                            <p className="text-xs opacity-80 mt-0.5">{info.desc}</p>
                          </div>
                          <p className="text-[10px] font-medium opacity-75 shrink-0 whitespace-nowrap">{b.dateAwarded}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">مێژووی چالاکییەکان</h3>
              </div>
              <div className="p-5">
                {userLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity size={48} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-slate-500 text-sm">هیچ چالاکییەکی پەسەندکراو نییە.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Activity size={14} className="text-slate-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">ڕێکەوت: {log.date}</p>
                            {log.notes && <p className="text-xs text-slate-500 truncate">{log.notes}</p>}
                          </div>
                        </div>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-md shrink-0">
                          +{log.totalPoints}
                        </span>
                      </div>
                    ))}
                    {userLogs.length > 10 && (
                      <p className="text-xs text-center text-slate-400 pt-2 border-t border-slate-100">
                        تەنها ١٠ چالاکی کۆتایی پیشاندراون
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Award Badge Modal */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">پێدانی نیشانە بە {selectedUser.name}</h3>
              
              <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(BADGE_INFO).filter(([k]) => !k.startsWith('milestone_')).map(([key, info]) => {
                  const Icon = info.icon;
                  return (
                    <label key={key} className={\`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors \${selectedBadge === key ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}\`}>
                      <input 
                        type="radio" 
                        name="badge" 
                        value={key} 
                        checked={selectedBadge === key}
                        onChange={() => setSelectedBadge(key)}
                        className="hidden"
                      />
                      <div className={\`\${info.bg} \${info.color} p-2 rounded-lg shrink-0\`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{info.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{info.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowBadgeModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm"
                >
                  پاشگەزبوونەوە
                </button>
                <button 
                  onClick={handleAwardBadge}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                >
                  پێدان
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }`;

code = code.substring(0, startIndex) + newReturn + code.substring(endIndex);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
