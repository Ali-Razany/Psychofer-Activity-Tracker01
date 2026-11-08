const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-paper p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="order-2 sm:order-1">
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">کۆی خاڵەکان</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
            </div>
            <div className="order-1 sm:order-2 relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="fluent-emoji:sports-medal" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="fluent-emoji:sports-medal" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
        
        <div className="bg-surface-paper p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="order-2 sm:order-1">
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">پلە لەسەر ئاستی گشتی</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800">#{userRank}</h3>
            </div>
            <div className="order-1 sm:order-2 relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="fluent-emoji:trophy" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="fluent-emoji:trophy" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="bg-surface-paper p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="order-2 sm:order-1">
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">ژمارەی چالاکییەکان</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800">{userLogs.length}</h3>
            </div>
            <div className="order-1 sm:order-2 relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="fluent-emoji:chart-increasing" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="fluent-emoji:chart-increasing" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <button 
          onClick={() => { if (onNavigate) onNavigate('add-activity'); }}
          className="bg-primary hover:bg-primary-dark transition-colors p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group text-right flex flex-col justify-between"
        >
          <div className="relative z-10 flex justify-between items-start w-full">
            <div>
              <p className="text-white/80 text-[11px] sm:text-sm font-medium mb-1 truncate">زیادکردن</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight">تۆمارکردنی<br/>چالاکی</h3>
            </div>
            <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 text-white rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="hugeicons:plus-sign" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="hugeicons:book-open-01" width={64} className="sm:w-20 sm:h-20 text-white" />
          </div>
        </button>
      </div>`;

const newStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-surface-paper p-2.5 sm:p-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right">
          <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-primary/10 text-primary rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:sports-medal" className="text-base sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0.5 sm:mb-1 truncate w-full">کۆی خاڵەکان</p>
            <h3 className="text-sm sm:text-2xl md:text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:sports-medal" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
        
        <div className="bg-surface-paper p-2.5 sm:p-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right">
          <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:trophy" className="text-base sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0.5 sm:mb-1 truncate w-full">ئاست</p>
            <h3 className="text-sm sm:text-2xl md:text-3xl font-bold text-neutral-800">#{userRank}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:trophy" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="bg-surface-paper p-2.5 sm:p-6 rounded-[16px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right">
          <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="fluent-emoji:chart-increasing" className="text-base sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-neutral-500 text-[9px] sm:text-sm font-medium mb-0.5 sm:mb-1 truncate w-full">چالاکییەکان</p>
            <h3 className="text-sm sm:text-2xl md:text-3xl font-bold text-neutral-800">{userLogs.length}</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="fluent-emoji:chart-increasing" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <button 
          onClick={() => { if (onNavigate) onNavigate('add-activity'); }}
          className="bg-primary hover:bg-primary-dark transition-colors p-2.5 sm:p-6 rounded-[16px] sm:rounded-[24px] border border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group flex flex-col items-center sm:items-start text-center sm:text-right w-full h-full"
        >
          <div className="relative z-10 w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:absolute sm:top-6 sm:left-6 bg-white/20 text-white rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Icon icon="hugeicons:plus-sign" className="text-base sm:text-2xl" />
          </div>
          <div className="relative z-10 w-full mt-auto sm:mt-0">
            <p className="text-white/80 text-[9px] sm:text-sm font-medium mb-0.5 sm:mb-1 truncate w-full">زیادکردن</p>
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white leading-tight">تۆمارکردن</h3>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-10 pointer-events-none transition-transform group-hover:scale-110 hidden sm:block">
            <Icon icon="hugeicons:book-open-01" width={64} className="sm:w-20 sm:h-20 text-white" />
          </div>
        </button>
      </div>`;

content = content.replace(oldStatsRow, newStatsRow);
fs.writeFileSync('src/components/Dashboard.tsx', content);
