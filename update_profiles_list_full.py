import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Step 1: Add the viewMode state
content = content.replace(
    "const [selectedBadge, setSelectedBadge] = useState('consistency');",
    "const [selectedBadge, setSelectedBadge] = useState('consistency');\n  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');"
)

# Step 2: Replace the search header
old_search = """      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="relative">
          <Icon icon="mynaui:search" width={18} />
          <input 
            type="text"
            placeholder="گەڕان بەدوای ناو یان دەستە..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>"""

new_search = """      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Icon icon="mynaui:search" width={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text"
            placeholder="گەڕان بەدوای ناو یان دەستە..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] pr-10 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-1 bg-surface-bg p-1 rounded-[20px] border border-surface-border self-end sm:self-auto shrink-0">
          <button 
            onClick={() => setViewMode('grid-large')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'grid-large' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="گەورە"
          >
            <Icon icon="hugeicons:grid-view" width={20} />
          </button>
          <button 
            onClick={() => setViewMode('grid-small')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'grid-small' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="بچووک"
          >
            <Icon icon="hugeicons:dashboard-square-01" width={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="لیست"
          >
            <Icon icon="hugeicons:menu-01" width={20} />
          </button>
        </div>
      </div>"""
content = content.replace(old_search, new_search)

# Step 3: Replace the user list rendering completely
old_list = """      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            onClick={() => setSelectedUser(user)}
            className="bg-surface-paper rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:border-primary/30 hover:shadow-custom transition-all cursor-pointer text-center group overflow-hidden relative"
          >
            <div className="h-20 bg-gradient-to-r from-primary-light/30 to-primary/10 relative">
              <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between p-2">
                <Icon icon="fluent-emoji:sparkles" width={40} className="transform -translate-x-4 -translate-y-4" />
              </div>
            </div>
            
            <div className="px-6 pb-6 relative -mt-10">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-sm" />
              ) : (
                <div className="w-20 h-20 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-3xl mx-auto mb-3 border-4 border-white shadow-sm group-hover:scale-105 transition-transform">
                  {user.name.charAt(0)}
                </div>
              )}
              
              <h3 className="font-bold text-neutral-800 text-lg truncate group-hover:text-primary transition-colors">{user.name}</h3>
              <p className="text-xs text-neutral-500 mt-1 truncate">
                {getRoleName((user.roles?.[0] || "Member"))} • {departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || "")}
              </p>
              {user.jobTitle && <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{user.jobTitle}</p>}
              
              <div className="mt-4 pt-4 border-t border-surface-border flex justify-between items-center">
                <div className="flex gap-1 h-8 items-center">
                  {(!user.badges || user.badges.length === 0) ? (
                    <span className="text-xs text-neutral-400">بێ نیشانە</span>
                  ) : (
                    <>
                      {user.badges.slice(0, 3).map((b, idx) => {
                        const info = BADGE_INFO[b.type];
                        if (!info) return null;
                        return (
                          <div key={idx} className={`${info.bg} ${info.color} p-1.5 rounded-full shadow-sm`} title={info.label}>
                            <Icon icon={info.icon} width={16} />
                          </div>
                        );
                      })}
                      {(user.badges.length) > 3 && (
                        <div className="bg-surface-bg text-neutral-500 p-1.5 px-2 rounded-full text-xs font-bold border border-surface-border flex items-center shadow-sm">
                          +{(user.badges.length) - 3}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-bold border border-amber-100">
                  {user.points}
                  <Icon icon="fluent-emoji:star" width={14} />
                </div>
            </div>
          </div>
          </div>
        ))}
      </div>"""

new_list = """      <div className={`grid gap-4 ${
        viewMode === 'grid-large' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 
        viewMode === 'grid-small' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 
        'grid-cols-1'
      }`}>
        {filteredUsers.map(user => {
          const dept = departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || "");
          const role = getRoleName((user.roles?.[0] || "Member"));
          
          if (viewMode === 'list') {
            return (
              <div 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className="bg-surface-paper rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:border-primary/30 hover:shadow-custom transition-all cursor-pointer p-3 sm:p-4 flex items-center gap-4 group"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-xl border border-surface-border shrink-0 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-neutral-800 text-base sm:text-lg truncate group-hover:text-primary transition-colors">{user.name}</h3>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border border-amber-100 shrink-0">
                      {user.points} <Icon icon="fluent-emoji:star" width={12} />
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-neutral-500 truncate mt-0.5">
                    {role} • {dept}
                  </p>
                  {user.jobTitle && <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">{user.jobTitle}</p>}
                </div>
                
                <div className="hidden sm:flex gap-1 items-center shrink-0">
                  {(!user.badges || user.badges.length === 0) ? null : (
                    <>
                      {user.badges.slice(0, 3).map((b, idx) => {
                        const info = BADGE_INFO[b.type];
                        if (!info) return null;
                        return (
                          <div key={idx} className={`${info.bg} ${info.color} p-1.5 rounded-full shadow-sm`} title={info.label}>
                            <Icon icon={info.icon} width={16} />
                          </div>
                        );
                      })}
                      {(user.badges.length) > 3 && (
                        <div className="bg-surface-bg text-neutral-500 p-1.5 rounded-full text-xs font-bold border border-surface-border">
                          +{(user.badges.length) - 3}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          }
          
          const isSmall = viewMode === 'grid-small';

          return (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className="bg-surface-paper rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:border-primary/30 hover:shadow-custom transition-all cursor-pointer text-center group overflow-hidden relative flex flex-col"
            >
              <div className={`${isSmall ? 'h-12' : 'h-20'} bg-gradient-to-r from-primary-light/30 to-primary/10 relative shrink-0`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between p-2">
                  <Icon icon="fluent-emoji:sparkles" width={isSmall ? 24 : 40} className={`transform ${isSmall ? '-translate-x-2 -translate-y-2' : '-translate-x-4 -translate-y-4'}`} />
                </div>
              </div>
              
              <div className={`${isSmall ? 'px-3 pb-4 -mt-6' : 'px-6 pb-6 -mt-10'} relative flex-1 flex flex-col`}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={`${isSmall ? 'w-12 h-12' : 'w-20 h-20'} rounded-full object-cover mx-auto mb-2 sm:mb-3 border-2 sm:border-4 border-white shadow-sm shrink-0`} />
                ) : (
                  <div className={`${isSmall ? 'w-12 h-12 text-xl' : 'w-20 h-20 text-3xl'} bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold mx-auto mb-2 sm:mb-3 border-2 sm:border-4 border-white shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                    {user.name.charAt(0)}
                  </div>
                )}
                
                <h3 className={`font-bold text-neutral-800 ${isSmall ? 'text-sm' : 'text-lg'} truncate group-hover:text-primary transition-colors`}>{user.name}</h3>
                <p className={`text-[10px] sm:text-xs text-neutral-500 mt-1 ${isSmall ? 'line-clamp-2' : 'truncate'}`}>
                  {role} {isSmall ? <><br/>{dept}</> : <>• {dept}</>}
                </p>
                {user.jobTitle && !isSmall && <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{user.jobTitle}</p>}
                
                <div className="flex-1"></div>
                
                <div className={`mt-3 sm:mt-4 ${isSmall ? 'pt-2' : 'pt-4'} border-t border-surface-border flex justify-between items-center shrink-0`}>
                  <div className="flex gap-1 h-6 sm:h-8 items-center">
                    {(!user.badges || user.badges.length === 0) ? (
                      <span className="text-[10px] sm:text-xs text-neutral-400">بێ نیشانە</span>
                    ) : (
                      <>
                        {user.badges.slice(0, isSmall ? 2 : 3).map((b, idx) => {
                          const info = BADGE_INFO[b.type];
                          if (!info) return null;
                          return (
                            <div key={idx} className={`${info.bg} ${info.color} p-1 sm:p-1.5 rounded-full shadow-sm`} title={info.label}>
                              <Icon icon={info.icon} width={isSmall ? 12 : 16} />
                            </div>
                          );
                        })}
                        {(user.badges.length) > (isSmall ? 2 : 3) && (
                          <div className="bg-surface-bg text-neutral-500 p-1 px-1.5 sm:p-1.5 sm:px-2 rounded-full text-[10px] sm:text-xs font-bold border border-surface-border flex items-center shadow-sm">
                            +{(user.badges.length) - (isSmall ? 2 : 3)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className={`flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full ${isSmall ? 'text-[10px]' : 'text-xs'} font-bold border border-amber-100 shrink-0`}>
                    {user.points}
                    <Icon icon="fluent-emoji:star" width={isSmall ? 10 : 14} />
                  </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>"""

content = content.replace(old_list, new_list)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)

