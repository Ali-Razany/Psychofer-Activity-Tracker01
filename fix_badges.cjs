const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldBadges = `      {/* Badges & Rewards */}
      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:star-rate-rounded" width={18} />
          باج و دەستکەوتەکانت
        </h3>
        {(!currentUser.badges || currentUser.badges.length === 0) ? (
          <div className="text-center py-6 text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border">
            هێشتا هیچ نیشانەیەکت بەدەست نەهێناوە. بەردەوام بە لە کارەکانت!
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {currentUser.badges.map((b, idx) => {
              const info = BADGE_INFO[b.type];
              if (!info) return null;
              return (
                <button 
                  key={idx} 
                  onClick={() => setViewBadgeDetails({...info, date: ''})}
                  className={\`\${info.bg} \${info.color} p-2.5 rounded-full flex items-center justify-center border border-white/40 shadow-sm relative overflow-hidden group hover:scale-105 transition-transform\`}
                  title={info.label}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <Icon icon={info.icon} width={26} />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>`;

const newBadges = `      {/* Badges & Rewards */}
      <div className="bg-surface-paper p-4 sm:p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h3 className="text-[13px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="material-symbols:star-rate-rounded" className="text-[14px] sm:text-[18px]" />
          باج و دەستکەوتەکانت
        </h3>
        {(!currentUser.badges || currentUser.badges.length === 0) ? (
          <div className="text-center py-6 text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border text-sm">
            هێشتا هیچ نیشانەیەکت بەدەست نەهێناوە. بەردەوام بە لە کارەکانت!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {currentUser.badges.map((b, idx) => {
              const info = BADGE_INFO[b.type];
              if (!info) return null;
              return (
                <button 
                  key={idx} 
                  onClick={() => setViewBadgeDetails({...info, date: ''})}
                  className={\`\${info.bg} \${info.color} p-1.5 sm:p-2.5 rounded-full flex items-center justify-center border border-white/40 shadow-sm relative overflow-hidden group hover:scale-105 transition-transform\`}
                  title={info.label}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
                    <Icon icon={info.icon} className="text-[18px] sm:text-[26px]" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>`;

content = content.replace(oldBadges, newBadges);
fs.writeFileSync('src/components/Dashboard.tsx', content);
