const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldBtn = `<div className="mb-6">
        <button
          onClick={() => setShowWorkflowTasks(true)}
          className="w-full flex items-center justify-between p-4 sm:p-6 bg-gradient-to-l from-primary/5 to-transparent border border-primary/10 rounded-[24px] hover:bg-primary/5 transition-colors group shadow-sm"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <Icon icon="solar:round-transfer-bold-duotone" width={24} />
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">پڕۆسە و ڕاسپاردەکان</h3>
              <p className="text-xs sm:text-sm text-neutral-500">بینین و بەڕێوەبردنی کارەکان و ڕاسپاردەکان</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white shadow-sm border border-surface-border rounded-full flex items-center justify-center text-neutral-400 group-hover:text-primary group-hover:border-primary/30 transition-all mr-4 shrink-0">
            <Icon icon="solar:arrow-left-linear" width={20} className="rtl:rotate-180" />
          </div>
        </button>
      </div>`;

const newBtn = `<div className="mb-6">
        <button
          onClick={() => setShowWorkflowTasks(true)}
          className="w-full flex items-center justify-between p-4 sm:p-6 bg-gradient-to-l from-orange-50 to-transparent border border-orange-200/50 rounded-[24px] hover:bg-orange-50 transition-colors group shadow-sm"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
              <Icon icon="solar:round-transfer-bold-duotone" width={24} />
            </div>
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-neutral-900">پڕۆسە و ڕاسپاردەکان</h3>
              <p className="text-xs sm:text-sm text-neutral-500">بینین و بەڕێوەبردنی کارەکان و ڕاسپاردەکان</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white shadow-sm border border-surface-border rounded-full flex items-center justify-center text-neutral-400 group-hover:text-orange-600 group-hover:border-orange-300 transition-all mr-4 shrink-0">
            <Icon icon="solar:arrow-left-linear" width={20} className="rtl:rotate-180" />
          </div>
        </button>
      </div>`;

content = content.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/Dashboard.tsx', content);
