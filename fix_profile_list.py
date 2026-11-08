import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Replace the view controls header if needed? Wait, the controls are above the list. Let's see them.
# The `filteredUsers.map(user => {` starts the rendering.

pattern = re.compile(r'        \{filteredUsers\.map\(user => \{.*?          \);\n        \}\)\}\n      </div>\n    </div>\n  \);\n\}', re.DOTALL)

new_list = """        {filteredUsers.map(user => {
          const dept = departments.find(d => d.id === (user.departments?.[0] || ""))?.name || (user.departments?.[0] || "");
          const role = getRoleName((user.roles?.[0] || "Member"));
          
          if (viewMode === 'list') {
            return (
              <div 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className="bg-surface-paper rounded-[24px] shadow-sm border border-surface-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-5 group"
              >
                <div className="relative">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-sm shrink-0" />
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-light to-primary-light/50 text-primary-dark rounded-full flex items-center justify-center font-bold text-xl border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-2 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold border-2 border-white shadow-sm flex items-center gap-0.5">
                    {user.points} <Icon icon="fluent-emoji:star" width={10} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-neutral-800 text-base sm:text-lg truncate group-hover:text-primary transition-colors">{user.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] sm:text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">{role}</span>
                    <span className="text-[10px] sm:text-xs font-medium text-neutral-500 truncate">{dept}</span>
                  </div>
                  {user.jobTitle && <p className="text-[10px] sm:text-xs text-indigo-500 font-medium truncate mt-1">{user.jobTitle}</p>}
                </div>
                
                <div className="hidden sm:flex gap-1.5 items-center shrink-0">
                  {(!user.badges || user.badges.length === 0) ? (
                    <span className="text-xs text-neutral-400 font-medium mr-4">بێ دەستکەوت</span>
                  ) : (
                    <>
                      {user.badges.slice(0, 3).map((b, idx) => {
                        const info = BADGE_INFO[b.type];
                        if (!info) return null;
                        return (
                          <div key={idx} className={`${info.bg} ${info.color} w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-white/50`} title={info.label}>
                            <Icon icon={info.icon} width={20} />
                          </div>
                        );
                      })}
                      {(user.badges.length) > 3 && (
                        <div className="w-9 h-9 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center text-xs font-bold border border-surface-border">
                          +{(user.badges.length) - 3}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="text-neutral-300 group-hover:text-primary transition-colors mr-2">
                  <Icon icon="hugeicons:arrow-left-01" width={20} />
                </div>
              </div>
            );
          }
          
          const isSmall = viewMode === 'grid-small';
          
          return (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className="bg-surface-paper rounded-[32px] shadow-sm border border-surface-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer text-center group overflow-hidden relative flex flex-col"
            >
              <div className={`${isSmall ? 'h-16' : 'h-24'} bg-gradient-to-br from-primary-light/40 to-amber-50 relative shrink-0`}>
                <div className="absolute top-0 right-0 w-full h-full bg-white/20 blur-xl"></div>
              </div>
              
              <div className={`${isSmall ? 'px-4 pb-5 -mt-8' : 'px-6 pb-6 -mt-12'} relative flex-1 flex flex-col items-center`}>
                <div className="relative mb-3">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={`${isSmall ? 'w-16 h-16' : 'w-24 h-24'} rounded-full object-cover border-[3px] border-white shadow-sm shrink-0`} />
                  ) : (
                    <div className={`${isSmall ? 'w-16 h-16 text-2xl' : 'w-24 h-24 text-4xl'} bg-primary-light/30 text-primary rounded-full flex items-center justify-center font-bold border-[3px] border-white shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                    <div className={`bg-amber-100 text-amber-800 ${isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'} rounded-full font-bold border-2 border-white shadow-sm flex items-center gap-1`}>
                      <Icon icon="fluent-emoji:star" width={isSmall ? 12 : 14} />
                      {user.points}
                    </div>
                  </div>
                </div>
                
                <h3 className={`font-extrabold text-neutral-800 ${isSmall ? 'text-base mt-2' : 'text-xl mt-1'} truncate w-full group-hover:text-primary transition-colors`}>{user.name}</h3>
                
                <div className={`flex flex-wrap items-center justify-center gap-1 mt-1.5 ${isSmall ? 'mb-1' : 'mb-3'}`}>
                  <span className={`bg-neutral-100 text-neutral-600 rounded-full font-bold ${isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
                    {role}
                  </span>
                  {!isSmall && (
                    <span className="bg-primary-light/20 text-primary-dark rounded-full font-bold text-xs px-2.5 py-1 truncate max-w-[120px]">
                      {dept}
                    </span>
                  )}
                </div>
                
                {user.jobTitle && !isSmall && <p className="text-xs text-indigo-500 font-medium mt-1 truncate w-full px-4">{user.jobTitle}</p>}
                
                <div className="flex-1"></div>
                
                <div className={`mt-4 w-full pt-4 border-t border-surface-border flex justify-center items-center shrink-0`}>
                  <div className="flex gap-1.5 h-8 items-center justify-center">
                    {(!user.badges || user.badges.length === 0) ? (
                      <span className="text-xs text-neutral-400 font-medium">هێشتا بێ دەستکەوتە</span>
                    ) : (
                      <>
                        {user.badges.slice(0, isSmall ? 3 : 4).map((b, idx) => {
                          const info = BADGE_INFO[b.type];
                          if (!info) return null;
                          return (
                            <div key={idx} className={`${info.bg} ${info.color} w-8 h-8 rounded-full flex items-center justify-center shadow-sm`} title={info.label}>
                              <Icon icon={info.icon} width={16} />
                            </div>
                          );
                        })}
                        {(user.badges.length) > (isSmall ? 3 : 4) && (
                          <div className="w-8 h-8 bg-neutral-100 text-neutral-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-surface-border shadow-sm">
                            +{(user.badges.length) - (isSmall ? 3 : 4)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}"""

if pattern.search(content):
    content = pattern.sub(new_list, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found")
