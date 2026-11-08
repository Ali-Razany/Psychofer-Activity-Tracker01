import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_stats = """      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-neutral-500 text-sm font-medium mb-1">کۆی خاڵەکان</p>
            <h3 className="text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
          </div>
          <div className="relative z-10 w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:sports-medal" width={24} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
            <Icon icon="fluent-emoji:sports-medal" width={80} />
          </div>
        </div>
        
        <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-neutral-500 text-sm font-medium mb-1">پلە لەسەر ئاستی گشتی</p>
            <h3 className="text-3xl font-bold text-neutral-800">#{userRank}</h3>
          </div>
          <div className="relative z-10 w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:trophy" width={24} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
            <Icon icon="fluent-emoji:trophy" width={80} />
          </div>
        </div>

        <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-neutral-500 text-sm font-medium mb-1">چالاکییە پەسەندکراوەکان</p>
            <h3 className="text-3xl font-bold text-neutral-800">{approvedLogs}</h3>
          </div>
          <div className="relative z-10 w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:check-mark-button" width={24} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
            <Icon icon="fluent-emoji:check-mark-button" width={80} />
          </div>
        </div>

        <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-neutral-500 text-sm font-medium mb-1">لە چاوەڕوانیدا</p>
            <h3 className="text-3xl font-bold text-neutral-800">{pendingLogs}</h3>
          </div>
          <div className="relative z-10 w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
            <Icon icon="fluent-emoji:hourglass-done" width={24} />
          </div>
          <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
            <Icon icon="fluent-emoji:hourglass-done" width={80} />
          </div>
        </div>
      </div>"""

new_stats = """      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-paper p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="order-2 sm:order-1">
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">کۆی خاڵەکان</p>
              <h3 className="text-xl sm:text-3xl font-bold text-neutral-800">{currentUser.points}</h3>
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
              <h3 className="text-xl sm:text-3xl font-bold text-neutral-800">#{userRank}</h3>
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
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">پەسەندکراوەکان</p>
              <h3 className="text-xl sm:text-3xl font-bold text-neutral-800">{approvedLogs}</h3>
            </div>
            <div className="order-1 sm:order-2 relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="fluent-emoji:check-mark-button" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="fluent-emoji:check-mark-button" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>

        <div className="bg-surface-paper p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
            <div className="order-2 sm:order-1">
              <p className="text-neutral-500 text-[11px] sm:text-sm font-medium mb-1 truncate">لە چاوەڕوانیدا</p>
              <h3 className="text-xl sm:text-3xl font-bold text-neutral-800">{pendingLogs}</h3>
            </div>
            <div className="order-1 sm:order-2 relative z-10 w-8 h-8 sm:w-12 sm:h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shadow-sm">
              <Icon icon="fluent-emoji:hourglass-done" className="text-base sm:text-2xl" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 opacity-5 sm:opacity-10 pointer-events-none transition-transform group-hover:scale-110">
            <Icon icon="fluent-emoji:hourglass-done" width={64} className="sm:w-20 sm:h-20" />
          </div>
        </div>
      </div>"""

content = content.replace(old_stats, new_stats)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

