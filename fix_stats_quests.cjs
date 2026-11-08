const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
        <div className="bg-surface-paper p-1 sm:p-6 pb-2.5 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[94px]">
          <div className="relative z-10 w-7 h-7 sm:w-12 sm:h-12 mt-1 mb-1.5 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:sports-medal" className="text-sm sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-[2px] sm:mb-1 truncate w-full">خاڵەکان</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:sports-medal" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
        
        <div className="bg-surface-paper p-1 sm:p-6 pb-2.5 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[94px]">
          <div className="relative z-10 w-7 h-7 sm:w-12 sm:h-12 mt-1 mb-1.5 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:trophy" className="text-sm sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-[2px] sm:mb-1 truncate w-full">ئاست</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">#{userRank}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:trophy" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="bg-surface-paper p-1 sm:p-6 pb-2.5 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[94px]">
          <div className="relative z-10 w-7 h-7 sm:w-12 sm:h-12 mt-1 mb-1.5 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:chart-increasing" className="text-sm sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-[2px] sm:mb-1 truncate w-full">چالاکی</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{userLogs.length}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:chart-increasing" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <button 
          onClick={() => { if (onNavigate) onNavigate('add-activity'); }}
          className="bg-primary hover:bg-primary-dark transition-colors p-1 sm:p-6 pb-2.5 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right w-full h-full min-h-[94px]"
        >
          <div className="relative z-10 w-7 h-7 sm:w-12 sm:h-12 mt-1 mb-1.5 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-white/20 text-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="hugeicons:plus-sign" className="text-sm sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-white/80 text-[9px] sm:text-sm font-medium mb-[2px] sm:mb-1 truncate w-full">زیادکردن</p>
            <h3 className="text-[13px] sm:text-xl md:text-2xl font-bold text-white leading-tight">تۆمارکردن</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="hugeicons:book-open-01" width={64} className="sm:w-20 sm:h-20 text-white" />
          </div>
        </button>
      </div>`;

const newStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">
        <div className="bg-surface-paper p-1.5 sm:p-6 pb-2 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right min-h-[88px]">
          <div className="relative z-10 w-6 h-6 sm:w-12 sm:h-12 mt-1 mb-1 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:sports-medal" className="text-xs sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0 truncate w-full">خاڵەکان</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
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
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0 truncate w-full">ئاست</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">#{userRank}</h3>
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
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0 truncate w-full">چالاکی</p>
            <h3 className="text-[13px] sm:text-2xl md:text-3xl font-bold text-neutral-800">{userLogs.length}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:chart-increasing" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <button 
          onClick={() => { if (onNavigate) onNavigate('add-activity'); }}
          className="bg-primary hover:bg-primary-dark transition-colors p-1.5 sm:p-6 pb-2 sm:pb-6 rounded-[16px] sm:rounded-[24px] border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right w-full h-full min-h-[88px]"
        >
          <div className="relative z-10 w-6 h-6 sm:w-12 sm:h-12 mt-1 mb-1 sm:mt-0 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-white/20 text-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="hugeicons:plus-sign" className="text-xs sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-white/80 text-[9px] sm:text-sm font-medium mb-0 truncate w-full">زیادکردن</p>
            <h3 className="text-[13px] sm:text-xl md:text-2xl font-bold text-white leading-tight">تۆمارکردن</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="hugeicons:book-open-01" width={64} className="sm:w-20 sm:h-20 text-white" />
          </div>
        </button>
      </div>`;

content = content.replace(oldStatsRow, newStatsRow);

const oldQuests = `      {/* Recommended Quests */}
      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:bullseye" width={24} />
          ئەو کارانەی کە دەتوانیت بیانکەیت
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activities.filter(a => (a.department || "") === (currentUser?.departments?.[0] || "")).slice(0, 4).map(task => (
            <div key={task.id} className="bg-surface-bg p-4 rounded-[20px] border border-surface-border flex items-start gap-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform shrink-0">
                <Icon icon="fluent-emoji:star" width={24} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-800 text-sm mb-1">{task.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    +{task.basePoints} خاڵ
                  </span>
                  {<span className="text-xs text-neutral-500">جۆری چەندایەتی</span>}
                </div>
              </div>
            </div>
          ))}`;

const newQuests = `      {/* Recommended Quests */}
      <div className="bg-surface-paper p-4 md:p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-[13px] md:text-lg font-bold text-neutral-800 mb-3 md:mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:bullseye" width={20} className="md:w-6 md:h-6" />
          ئەو کارانەی کە دەتوانیت بیانکەیت
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {activities.filter(a => (a.department || "") === (currentUser?.departments?.[0] || "")).slice(0, 4).map(task => (
            <div key={task.id} className="bg-surface-bg p-3 md:p-4 rounded-[20px] border border-surface-border flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform shrink-0">
                <Icon icon="fluent-emoji:star" width={20} className="md:w-6 md:h-6" />
              </div>
              <div className="-mt-1">
                <h4 className="font-bold text-neutral-800 text-[12px] sm:text-sm mb-0.5 leading-tight">{task.name}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold">
                    +{task.basePoints} خاڵ
                  </span>
                  {<span className="text-[10px] sm:text-xs text-neutral-500">جۆری چەندایەتی</span>}
                </div>
              </div>
            </div>
          ))}`;

content = content.replace(oldQuests, newQuests);
fs.writeFileSync('src/components/Dashboard.tsx', content);
