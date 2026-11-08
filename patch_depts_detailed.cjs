const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const target2 = `  // View 2: Detailed Department Page
  const dept = departments.find(d => d.id === selectedDeptId);
  if (!dept) {
    setSelectedDeptId(null);
    return null;
  }

  const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
  const colorClass = dept.color || 'bg-primary';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-paper border border-surface-border text-neutral-600 hover:bg-neutral-100 transition-colors shadow-sm"
        >
          <Icon icon="hugeicons:arrow-right-01" width={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">پەڕەی دەستە</h1>
          <p className="text-sm text-neutral-500 mt-1">زانیاری و ئەندامانی دەستە</p>
        </div>
      </div>

      <div className="bg-surface-paper rounded-[32px] overflow-hidden shadow-sm border border-surface-border">
        {/* Header */}
        <div className={\`p-6 md:p-8 flex items-center justify-between \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass} relative overflow-hidden\`}
             style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
          {/* Overlay gradient to make text readable usually if it's solid */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <Icon icon={dept.icon || "hugeicons:building-03"} width={32} />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-sm">{dept.name}</h2>
              <p className="text-white/90 mt-1 font-medium">{deptUsers.length} ئەندام</p>
            </div>
          </div>
          
          {canEditDept(dept.id) && (
            <button 
              onClick={() => setEditingDept(dept)}
              className="relative z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors border border-white/30"
              title="دەستکاری دەستە"
            >
              <Icon icon="hugeicons:edit-02" width={20} />
            </button>
          )}
        </div>

        {/* Manifesto Section */}
        <div className="p-6 md:p-8 border-b border-surface-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="hugeicons:document-text" width={22} className="text-primary" />
              کارنامەی دەستە
            </h3>
          </div>
          
          <div className="bg-neutral-50 p-6 rounded-[24px] border border-neutral-100 prose prose-neutral max-w-none prose-p:leading-relaxed">
            {dept.manifesto ? (
              <div className="whitespace-pre-wrap text-neutral-700">{dept.manifesto}</div>
            ) : (
              <div className="text-center py-6 text-neutral-400 font-medium">
                هێشتا کارنامە نەنووسراوە
              </div>
            )}
          </div>
        </div>

        {/* Members Section */}
        <div className="p-6 md:p-8 bg-surface-bg/30">
          <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
            <Icon icon="mynaui:users-group" width={22} className="text-primary" />
            ئەندامەکانی دەستە
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white p-4 rounded-[24px] border border-surface-border flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => {
                  if (onNavigate) {
                    setViewProfileId(user.id);
                    onNavigate('profiles');
                  }
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative w-14 h-14 rounded-full bg-white p-0.5">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-light/20 text-primary rounded-full flex items-center justify-center font-bold text-xl">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-800 text-base truncate group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{getRoleName(user.roles?.[0] || 'Member')} {user.jobTitle ? \`• \${user.jobTitle}\` : ''}</p>
                </div>
              </div>
            ))}
            {deptUsers.length === 0 && (
              <div className="col-span-full text-center py-8 text-neutral-400 font-medium">
                هیچ ئەندامێک نەدۆزرایەوە
              </div>
            )}
          </div>
        </div>
      </div>`;

const replace2 = `  // View 2: Detailed Department Page
  const dept = departments.find(d => d.id === selectedDeptId);
  if (!dept) {
    setSelectedDeptId(null);
    return null;
  }

  const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
  const colorClass = dept.color || 'bg-primary';

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:scale-105 transition-all shadow-sm"
        >
          <Icon icon="hugeicons:arrow-right-01" width={20} />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-neutral-800">گەڕانەوە بۆ دەستەکان</h1>
        </div>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-neutral-100 relative">
        {/* Header Cover */}
        <div className={\`h-40 md:h-48 flex items-center justify-center \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass} relative overflow-hidden\`}
             style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <Icon icon={dept.icon || "hugeicons:building-03"} width={200} />
          </div>
          
          {canEditDept(dept.id) && (
            <button 
              onClick={() => setEditingDept(dept)}
              className="absolute top-4 left-4 z-10 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/30 shadow-sm"
              title="دەستکاری دەستە"
            >
              <Icon icon="hugeicons:edit-02" width={20} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 mb-8">
            <div className={\`w-24 h-24 md:w-32 md:h-32 rounded-[28px] border-4 border-white shadow-xl flex items-center justify-center text-white z-10 \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass}\`}
                 style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
              <Icon icon={dept.icon || "hugeicons:building-03"} className="w-12 h-12 md:w-16 md:h-16" />
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">{dept.name}</h2>
              <p className="text-neutral-500 font-medium mt-1 flex items-center gap-1.5">
                <Icon icon="fluent-emoji:waving-hand" width={18} />
                بەخێربێیت بۆ ماڵی {dept.name}
              </p>
            </div>
            <div className="pb-2">
                <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-full font-bold border border-indigo-100">
                  <Icon icon="fluent-emoji:people-hugging" width={20} />
                  <span>{deptUsers.length} هاوڕێ لێرەن</span>
                </div>
            </div>
          </div>

          {/* Manifesto Section */}
          <div className="bg-neutral-50 p-6 md:p-8 rounded-[24px] border border-neutral-100 mb-8 shadow-inner">
            <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2 mb-4">
              <Icon icon="fluent-emoji:scroll" width={22} />
              باسی چی دەکەین لێرە؟
            </h3>
            
            <div className="prose prose-neutral max-w-none prose-p:leading-relaxed text-neutral-700 font-medium">
              {dept.manifesto ? (
                <div className="whitespace-pre-wrap">{dept.manifesto}</div>
              ) : (
                <div className="text-center py-6 text-neutral-400">
                  هێشتا هیچ زانیارییەک لێرە نەنووسراوە، بەڵام دڵنیاین شتی زۆر نایاب لە ڕێگایە!
                </div>
              )}
            </div>
          </div>

          {/* Members Section */}
          <div>
            <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
              <Icon icon="fluent-emoji:sparkles" width={22} />
              هاوڕێیانی ئەم دەستەیە
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deptUsers.map(user => (
                <div 
                  key={user.id} 
                  className="bg-white p-4 rounded-[24px] border border-neutral-100 flex items-center gap-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
                  onClick={() => {
                    if (onNavigate) {
                      setViewProfileId(user.id);
                      onNavigate('profiles');
                    }
                  }}
                >
                  <div className="relative">
                    <div className="relative w-14 h-14 rounded-full bg-neutral-100">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-800 text-base truncate group-hover:text-indigo-600 transition-colors">{user.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">{getRoleName(user.roles?.[0] || 'Member')} {user.jobTitle ? \`• \${user.jobTitle}\` : ''}</p>
                  </div>
                </div>
              ))}
              {deptUsers.length === 0 && (
                <div className="col-span-full text-center py-10 bg-neutral-50 rounded-[24px] text-neutral-400 font-medium border border-neutral-100 border-dashed">
                  هێشتا هیچ کەسێک نەهاتووەتە ئێرە
                </div>
              )}
            </div>
          </div>
        </div>
      </div>`;

if (code.includes(target2)) {
  code = code.replace(target2, replace2);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('Success 2');
} else {
  console.log('Failed to find target 2');
}
