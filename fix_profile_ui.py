import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# We need to extract the exact block to replace.
# It starts at:
#     return (
#       <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar rtl" dir="rtl">
# and ends right before:
#   return (
#     <div className="space-y-6">

pattern = re.compile(r'    return \(\n      <div className="h-full overflow-y-auto p-4 md:p-6 custom-scrollbar rtl" dir="rtl">.*?    \);\n  \}\n\n  return \(\n    <div className="space-y-6">', re.DOTALL)

new_profile_view = """    return (
      <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar rtl bg-surface-bg" dir="rtl">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Back & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => setSelectedUser(null)}
              className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors bg-surface-paper px-5 py-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border"
            >
              <Icon icon="hugeicons:arrow-right-01" width={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">گەڕانەوە بۆ لیستی ئەندامان</span>
            </button>
            
            {canAwardBadge && (
              <button 
                onClick={() => setShowBadgeModal(true)}
                className="bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Icon icon="fluent-emoji:sports-medal" width={20} />
                <span>پێدانی نیشانە</span>
              </button>
            )}
          </div>

          {/* Friendly Profile Header */}
          <div className="bg-surface-paper rounded-[32px] p-6 md:p-10 relative overflow-hidden shadow-sm border border-surface-border">
            {/* Soft decorative background */}
            <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-br from-primary-light/40 to-amber-100/40 rounded-t-[32px] pointer-events-none"></div>
            
            {/* Settings Button */}
            {selectedUser.id === currentUser?.id && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-profile-settings'))}
                className="absolute top-6 left-6 z-20 w-11 h-11 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-neutral-700 transition-all shadow-sm border border-neutral-200 hover:shadow"
              >
                <Icon icon="hugeicons:settings-01" width={24} />
              </button>
            )}

            <div className="relative z-10 flex flex-col items-center mt-8 md:mt-12 text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-white shadow-sm border-2 border-primary-light">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary-light/30 text-primary flex items-center justify-center font-bold text-5xl">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                  <div className="bg-amber-100 text-amber-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm border-2 border-white flex items-center gap-1.5">
                    <Icon icon="fluent-emoji:star" width={16} />
                    {selectedUser.points} خاڵ
                  </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-800 tracking-tight mb-2">
                {selectedUser.name}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="px-4 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm font-bold shadow-inner">
                  {getRoleName((selectedUser.roles?.[0] || "Member"))}
                </span>
                <span className="px-4 py-1.5 bg-primary-light/20 text-primary-dark rounded-full text-sm font-bold shadow-inner">
                  {departments.find(d => d.id === (selectedUser.departments?.[0] || ""))?.name || (selectedUser.departments?.[0] || "")}
                </span>
                {selectedUser.jobTitle && (
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold shadow-inner">
                    {selectedUser.jobTitle}
                  </span>
                )}
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div className="max-w-2xl mx-auto mb-6 bg-surface-bg rounded-3xl p-5 border border-surface-border relative">
                  <Icon icon="hugeicons:quote-up" width={24} className="absolute -top-3 -right-3 text-neutral-300 bg-surface-paper rounded-full p-1" />
                  <p className="text-neutral-600 leading-relaxed text-sm md:text-base font-medium">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {/* Socials */}
              <div className="flex items-center justify-center gap-4">
                {selectedUser.socials?.telegram && (
                  <a href={selectedUser.socials.telegram.startsWith('http') ? selectedUser.socials.telegram : `https://t.me/${selectedUser.socials.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-500 transition-colors shadow-sm">
                    <Icon icon="logos:telegram" width={24} />
                  </a>
                )}
                {selectedUser.socials?.facebook && (
                  <a href={selectedUser.socials.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700 transition-colors shadow-sm">
                    <Icon icon="logos:facebook" width={24} />
                  </a>
                )}
                {selectedUser.socials?.instagram && (
                  <a href={selectedUser.socials.instagram.startsWith('http') ? selectedUser.socials.instagram : `https://instagram.com/${selectedUser.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-600 transition-colors shadow-sm">
                    <Icon icon="skill-icons:instagram" width={24} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Badges Bento */}
            <div className="lg:col-span-1 bg-surface-paper rounded-[32px] p-6 shadow-sm border border-surface-border flex flex-col h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Icon icon="fluent-emoji:trophy" width={22} />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">دەستکەوتەکان</h3>
              </div>
              
              <div className="flex-1">
                {(!selectedUser.badges || selectedUser.badges.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-8 opacity-70">
                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-3">
                      <Icon icon="fluent-emoji:seedling" width={32} className="grayscale" />
                    </div>
                    <p className="text-neutral-500 text-sm font-medium">هێشتا هیچ دەستکەوتێکی نییە</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {selectedUser.badges.map((b, idx) => {
                      const info = BADGE_INFO[b.type];
                      if (!info) return null;
                      return (
                        <div key={idx} className={`${info.bg} ${info.color} p-4 rounded-3xl flex items-center gap-4 border border-white/40 shadow-sm relative overflow-hidden group`}>
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shrink-0 shadow-sm backdrop-blur-sm">
                            <Icon icon={info.icon} width={26} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-base">{info.label}</p>
                            <p className="text-xs font-medium opacity-80 mt-0.5 truncate">{info.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Activity History Bento */}
            <div className="lg:col-span-2 bg-surface-paper rounded-[32px] p-6 shadow-sm border border-surface-border flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Icon icon="fluent-emoji:chart-increasing" width={22} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-800">نوێترین چالاکییەکان</h3>
                </div>
                <div className="text-sm font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                  کۆی گشتی: {userLogs.length}
                </div>
              </div>

              <div className="flex-1">
                {userLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 opacity-70">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                      <Icon icon="fluent-emoji:sleeping-face" width={40} />
                    </div>
                    <p className="text-neutral-500 font-medium">هێشتا هیچ چالاکییەکی ئەنجام نەداوە.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userLogs.slice(0, 10).map((log, i) => {
                      const activityTask = activities.find(a => a.id === log.taskId);
                      return (
                      <div key={log.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-bg hover:bg-white border border-transparent hover:border-surface-border hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 group-hover:scale-110 transition-transform">
                            <Icon icon="hugeicons:task-done-01" width={20} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-neutral-800 truncate" title={activityTask?.name}>
                              {activityTask?.name || 'چالاکی نەناسراو'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-neutral-500 bg-white border border-surface-border px-2 py-0.5 rounded-md font-medium">
                                {log.date}
                              </span>
                              {log.notes && (
                                <span className="text-xs text-neutral-400 truncate max-w-[150px] sm:max-w-[200px]">
                                  {log.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0 ml-2">
                          <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            +{log.totalPoints}
                          </span>
                        </div>
                      </div>
                    )})}
                    {userLogs.length > 10 && (
                      <div className="pt-4 mt-2 text-center">
                        <p className="text-sm text-neutral-400 font-medium">
                          تەنها ١٠ چالاکی کۆتایی پیشاندراون
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Award Badge Modal */}
        {showBadgeModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setShowBadgeModal(false)}>
            <div className="bg-surface-paper rounded-[32px] shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] flex flex-col transform scale-100" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center gap-3 mb-6 shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center text-primary text-2xl">
                  <Icon icon="fluent-emoji:sports-medal" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">پێدانی دەستکەوت</h3>
                  <p className="text-sm text-neutral-500 mt-0.5">بە {selectedUser.name}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(BADGE_INFO).filter(([k]) => !k.startsWith('milestone_')).map(([key, info]) => {
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
                        <p className="font-bold text-neutral-900 text-base">{info.label}</p>
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
                  className="flex-1 py-3.5 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg text-sm"
                >
                  پێدان
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">"""

if pattern.search(content):
    content = pattern.sub(new_profile_view, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found")

