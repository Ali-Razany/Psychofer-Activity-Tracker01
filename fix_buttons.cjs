const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldTimeline = `      {/* Process Timeline */}
      <div className="mb-6">
        <button
          onClick={() => setShowWorkflowTasks(true)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-[20px] shadow-custom hover:shadow-lg transition-all group overflow-hidden relative text-white"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
              <Icon icon="solar:round-transfer-bold-duotone" width={20} />
            </div>
            <div className="text-right">
              <h3 className="text-sm sm:text-base font-bold text-white">پڕۆسە و ڕاسپاردەکان</h3>
              <p className="text-[10px] text-orange-50 opacity-90">بینین و بەڕێوەبردنی کارەکان و ڕاسپاردەکان</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 shadow-sm border border-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-white/30 transition-all mr-2 shrink-0 relative z-10 backdrop-blur-sm">
            <Icon icon="solar:arrow-left-linear" width={16} className="rtl:rotate-180" />
          </div>
        </button>
      </div>`;

const newTimeline = `      {/* Action Buttons */}
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
              <h3 className="text-[13px] sm:text-base font-bold text-white">تۆمارکردن</h3>
              <p className="text-[9px] sm:text-[10px] text-blue-100 opacity-90 truncate max-w-[80px] sm:max-w-none">زیادکردنی چالاکی نوێ</p>
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
              <h3 className="text-[13px] sm:text-base font-bold text-white">ڕاسپاردەکان</h3>
              <p className="text-[9px] sm:text-[10px] text-orange-50 opacity-90 truncate max-w-[80px] sm:max-w-none">بینین و بەڕێوەبردن</p>
            </div>
          </div>
        </button>
      </div>`;

content = content.replace(oldTimeline, newTimeline);

// Now remove the Add Activity button from the stats row
const oldStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-4">`;
const newStatsRow = `      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-4">`;

content = content.replace(oldStatsRow, newStatsRow);

const addActivityButtonInStats = `        <button 
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
`;

content = content.replace(addActivityButtonInStats, "");

fs.writeFileSync('src/components/Dashboard.tsx', content);
