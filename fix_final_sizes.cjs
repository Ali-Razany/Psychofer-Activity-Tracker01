const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Leaderboard Title
const oldLeaderboardTitle = `<h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="fluent-emoji:glowing-star" width={24} />
              پێشەنگەکان (Top)
            </h3>`;
const newLeaderboardTitle = `<h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="fluent-emoji:glowing-star" className="text-[18px] sm:text-[24px]" />
              پێشەنگەکان (Top)
            </h3>`;
content = content.replace(oldLeaderboardTitle, newLeaderboardTitle);

// 2. Gamification Title (Already changed, let's verify)
const oldGamificationTitle = `<h3 className="text-[13px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:target" className="text-[16px] sm:text-[24px]" />
          ئامانجی داهاتوو
        </h3>`;
const newGamificationTitle = `<h3 className="text-[14px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:target" className="text-[18px] sm:text-[24px]" />
          ئامانجی داهاتوو
        </h3>`;
content = content.replace(oldGamificationTitle, newGamificationTitle);

// 3. Leaderboard numbers (4th, 5th, etc)
const oldRankNumber = `<div className="w-8 h-8 rounded-full bg-white border border-surface-border flex items-center justify-center text-sm font-bold text-neutral-500 shadow-sm">
                      {index + 1}
                    </div>`;
const newRankNumber = `<div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border border-surface-border flex items-center justify-center text-[11px] sm:text-sm font-bold text-neutral-500 shadow-sm leading-[19px]">
                      {index + 1}
                    </div>`;
content = content.replace(oldRankNumber, newRankNumber);

// 4. Recharts Axes back to 12px (or 10px on mobile) - Recharts doesn't support Tailwind classes for fontSize easily, but we'll use 11 or 12. Let's use 11
const oldXAxis = `<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 11, fontWeight: 500}} dy={10} />`;
const newXAxis = `<XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 10, fontWeight: 500}} dy={10} />`;
content = content.replace(oldXAxis, newXAxis);

const oldYAxis = `<YAxis axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 11, fontWeight: 500}} dx={-10} />`;
const newYAxis = `<YAxis axisLine={false} tickLine={false} tick={{fill: '#54577A', fontSize: 10, fontWeight: 500}} dx={-10} />`;
content = content.replace(oldYAxis, newYAxis);


fs.writeFileSync('src/components/Dashboard.tsx', content);
