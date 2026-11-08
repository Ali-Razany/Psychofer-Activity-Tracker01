const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const statsCode = `
      {/* App Stats Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-paper p-4 md:p-6 rounded-[24px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">کۆی ئەندامان</p>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">{users.length}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:busts-in-silhouette" width={24} />
          </div>
        </div>
        <div className="bg-surface-paper p-4 md:p-6 rounded-[24px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500 mb-1">دەستەکانی کارکردن</p>
            <h3 className="text-2xl md:text-3xl font-bold text-neutral-800">{departments.length}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:handshake" width={24} />
          </div>
        </div>
      </div>
`;

// Remove it from the top
code = code.replace(statsCode, '');

// Insert it below Action Buttons and make it smaller
const smallerStatsCode = `
      {/* App Stats Overview */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-surface-paper p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] sm:text-sm text-neutral-500 mb-0.5">کۆی ئەندامان</p>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">{users.length}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:busts-in-silhouette" className="text-[16px] sm:text-[20px]" />
          </div>
        </div>
        <div className="bg-surface-paper p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] border border-surface-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] sm:text-sm text-neutral-500 mb-0.5">دەستەکانی کارکردن</p>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-800">{departments.length}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:handshake" className="text-[16px] sm:text-[20px]" />
          </div>
        </div>
      </div>
`;

const actionButtonsEnd = `      </div>

      {/* Stats Row */}`;

code = code.replace(actionButtonsEnd, `      </div>\n${smallerStatsCode}\n      {/* Stats Row */}`);

fs.writeFileSync('src/components/Dashboard.tsx', code);
