const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldBtn = `<button
          onClick={() => setShowWorkflowTasks(true)}
          className="w-full flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-orange-600 to-indigo-600 rounded-[20px] shadow-custom hover:shadow-lg transition-all group overflow-hidden relative text-white"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
          <div className="flex items-center gap-3 sm:gap-4 relative z-10">
            <div className="w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
              <Icon icon="solar:round-transfer-bold-duotone" width={20} />
            </div>
            <div className="text-right">
              <h3 className="text-sm sm:text-base font-bold text-white">پڕۆسە و ڕاسپاردەکان</h3>
              <p className="text-[10px] text-blue-100 opacity-90">بینین و بەڕێوەبردنی کارەکان و ڕاسپاردەکان</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/20 shadow-sm border border-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-white/30 transition-all mr-2 shrink-0 relative z-10 backdrop-blur-sm">
            <Icon icon="solar:arrow-left-linear" width={16} className="rtl:rotate-180" />
          </div>
        </button>`;

const newBtn = `<button
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
        </button>`;

content = content.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/Dashboard.tsx', content);
