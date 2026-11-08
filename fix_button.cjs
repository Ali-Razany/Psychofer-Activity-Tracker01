const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldBtn = `<div className="flex justify-start mb-4">
        <button
          onClick={() => setShowWorkflowTasks(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-surface-border shadow-sm text-neutral-800 font-bold rounded-2xl hover:bg-neutral-50 transition-colors"
        >
          <Icon icon="solar:round-transfer-bold-duotone" className="text-primary w-6 h-6" />
          پڕۆسە و ڕاسپاردەکان
          <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">
            <Icon icon="solar:arrow-left-linear" />
          </div>
        </button>
      </div>`;

const newBtn = `<div className="mb-6">
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

content = content.replace(oldBtn, newBtn);
fs.writeFileSync('src/components/Dashboard.tsx', content);
