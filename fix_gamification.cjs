const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldGamification = `      {/* Gamification Progress */}
      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-custom">
        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:target" width={24} />
          ئامانجی داهاتوو
        </h3>
        
        {(() => {
          let nextMilestone = 50;
          let milestoneLabel = '٥٠ خاڵ';
          let milestoneIcon = 'fluent-emoji:sports-medal';
          
          if (currentUser.points >= 50 && currentUser.points < 100) {
            nextMilestone = 100;
            milestoneLabel = '١٠٠ خاڵ';
            milestoneIcon = 'fluent-emoji:trophy';
          } else if (currentUser.points >= 100 && currentUser.points < 500) {
            nextMilestone = 500;
            milestoneLabel = '٥٠٠ خاڵ';
            milestoneIcon = 'fluent-emoji:glowing-star';
          } else if (currentUser.points >= 500) {
            return (
              <div className="flex items-center gap-4 p-4 bg-emerald-50 text-emerald-700 rounded-[20px] border border-emerald-100">
                <Icon icon="fluent-emoji:crown" width={40} />
                <div>
                  <h4 className="font-bold">تۆ گەیشتوویت بە بەرزترین ئاست!</h4>
                  <p className="text-sm">هەموو نیشانە سەرەکییەکانت بەدەستهێناوە.</p>
                </div>
              </div>
            );
          }
          const progressPercent = Math.min(100, Math.round((currentUser.points / nextMilestone) * 100));
          return (
            <div className="bg-surface-bg p-6 rounded-[20px] border border-surface-border relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Icon icon={milestoneIcon} width={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">بەدەستهێنانی نیشانەی {milestoneLabel}</h4>
                    <p className="text-sm text-neutral-500">پێویستت بە {nextMilestone - currentUser.points} خاڵی ترە بۆ ئەم ئامانجە.</p>
                  </div>
                </div>
                <div className="font-bold text-xl text-primary">{progressPercent}%</div>
              </div>
              
              <div className="w-full bg-white rounded-full h-4 shadow-inner relative z-10 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-400 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: \`\${progressPercent}%\` }}
                >
                  <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>`;

const newGamification = `      {/* Gamification Progress */}
      <div className="bg-surface-paper p-4 sm:p-6 rounded-[24px] border border-surface-border shadow-custom">
        <h3 className="text-[13px] sm:text-lg font-bold text-neutral-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Icon icon="fluent-emoji:target" className="text-[16px] sm:text-[24px]" />
          ئامانجی داهاتوو
        </h3>
        
        {(() => {
          let nextMilestone = 50;
          let milestoneLabel = '٥٠ خاڵ';
          let milestoneIcon = 'fluent-emoji:sports-medal';
          
          if (currentUser.points >= 50 && currentUser.points < 100) {
            nextMilestone = 100;
            milestoneLabel = '١٠٠ خاڵ';
            milestoneIcon = 'fluent-emoji:trophy';
          } else if (currentUser.points >= 100 && currentUser.points < 500) {
            nextMilestone = 500;
            milestoneLabel = '٥٠٠ خاڵ';
            milestoneIcon = 'fluent-emoji:glowing-star';
          } else if (currentUser.points >= 500) {
            return (
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-50 text-emerald-700 rounded-[20px] border border-emerald-100">
                <Icon icon="fluent-emoji:crown" className="text-[28px] sm:text-[40px]" />
                <div>
                  <h4 className="font-bold text-[13px] sm:text-base">تۆ گەیشتوویت بە بەرزترین ئاست!</h4>
                  <p className="text-[11px] sm:text-sm">هەموو نیشانە سەرەکییەکانت بەدەستهێناوە.</p>
                </div>
              </div>
            );
          }
          const progressPercent = Math.min(100, Math.round((currentUser.points / nextMilestone) * 100));
          return (
            <div className="bg-surface-bg p-4 sm:p-6 rounded-[20px] border border-surface-border relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="bg-white p-1.5 sm:p-2 rounded-full shadow-sm shrink-0">
                    <Icon icon={milestoneIcon} className="text-[20px] sm:text-[32px]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800 text-[12px] sm:text-base">بەدەستهێنانی نیشانەی {milestoneLabel}</h4>
                    <p className="text-[10px] sm:text-sm text-neutral-500">پێویستت بە {nextMilestone - currentUser.points} خاڵی ترە بۆ ئەم ئامانجە.</p>
                  </div>
                </div>
                <div className="font-bold text-[14px] sm:text-xl text-primary">{progressPercent}%</div>
              </div>
              
              <div className="w-full bg-white rounded-full h-2.5 sm:h-4 shadow-inner relative z-10 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary to-blue-400 h-2.5 sm:h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: \`\${progressPercent}%\` }}
                >
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white/50 rounded-full animate-pulse mt-1 ml-1 sm:mt-1 sm:ml-1"></div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>`;

content = content.replace(oldGamification, newGamification);
fs.writeFileSync('src/components/Dashboard.tsx', content);
