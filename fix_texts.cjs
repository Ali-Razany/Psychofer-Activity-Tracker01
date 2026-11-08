const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Badges & Rewards h3
const oldBadgesTitle = `<h3 className="text-[13px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:star-rate-rounded" className="text-[14px] sm:text-[18px]" />
          باج و دەستکەوتەکانت
        </h3>`;
const newBadgesTitle = `<h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:star-rate-rounded" className="text-[16px] sm:text-[18px]" />
          باج و دەستکەوتەکانت
        </h3>`;
content = content.replace(oldBadgesTitle, newBadgesTitle);

// 2. Chart Title
const oldChartTitle = `<h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2 relative z-10">
            <Icon icon="fluent-emoji:chart-increasing" width={24} />
            پێشکەوتنەکانت لەم مانگەدا
          </h3>`;
const newChartTitle = `<h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2 relative z-10">
            <Icon icon="fluent-emoji:chart-increasing" className="text-[18px] sm:text-[24px]" />
            پێشکەوتنەکانت لەم مانگەدا
          </h3>`;
content = content.replace(oldChartTitle, newChartTitle);

// 3. Recharts Axis
const oldXAxis = `<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 12, fontWeight: 500}} dy={10} />`;
const newXAxis = `<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 11, fontWeight: 500}} dy={10} />`;
content = content.replace(oldXAxis, newXAxis);

const oldYAxis = `<YAxis axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 12, fontWeight: 500}} dx={-10} />`;
const newYAxis = `<YAxis axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 11, fontWeight: 500}} dx={-10} />`;
content = content.replace(oldYAxis, newYAxis);

// 4. Recommended Quests cards (force 12px for title and 10px for subtitle)
const oldQuestsCards = `        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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

const newQuestsCards = `        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {activities.filter(a => (a.department || "") === (currentUser?.departments?.[0] || "")).slice(0, 4).map(task => (
            <div key={task.id} className="bg-surface-bg p-3 md:p-4 rounded-[20px] border border-surface-border flex items-center gap-3 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group text-[12px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform shrink-0">
                <Icon icon="fluent-emoji:star" width={20} className="md:w-6 md:h-6" />
              </div>
              <div className="-mt-1">
                <h4 className="font-bold text-neutral-800 text-[12px] mb-0.5 leading-tight">{task.name}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                    +{task.basePoints} خاڵ
                  </span>
                  {<span className="text-[10px] text-neutral-500">جۆری چەندایەتی</span>}
                </div>
              </div>
            </div>
          ))}`;

content = content.replace(oldQuestsCards, newQuestsCards);

fs.writeFileSync('src/components/Dashboard.tsx', content);
