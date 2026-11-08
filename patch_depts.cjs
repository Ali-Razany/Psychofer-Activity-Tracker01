const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const target1 = `  // View 1: Main Departments Grid
  if (!selectedDeptId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">دەستەکان</h1>
            <p className="text-sm text-neutral-500 mt-1">ناساندن و ئەندامانی دەستەکان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
            const colorClass = dept.color || 'bg-primary';
            
            return (
              <div 
                key={dept.id} 
                onClick={() => setSelectedDeptId(dept.id)}
                className="bg-surface-paper rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-surface-border cursor-pointer group"
              >
                <div className={\`h-32 flex items-center justify-center \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass} relative overflow-hidden\`}
                     style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    <Icon icon={dept.icon || "hugeicons:building-03"} width={32} />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-extrabold text-neutral-800 mb-1 group-hover:text-primary transition-colors">{dept.name}</h3>
                  <p className="text-neutral-500 font-medium text-sm flex items-center justify-center gap-1.5">
                    <Icon icon="mynaui:users-group" width={16} />
                    {deptUsers.length} ئەندام
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }`;

const replace1 = `  // View 1: Main Departments Grid
  if (!selectedDeptId) {
    return (
      <div className="space-y-6 pb-12">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-50 rounded-[28px] p-8 md:p-10 flex items-center justify-between border border-indigo-200 relative overflow-hidden mb-10 shadow-sm">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-950 mb-3 tracking-tight">دەستەکانمان</h1>
            <p className="text-indigo-900/80 font-medium text-base md:text-lg leading-relaxed">ئەو تیمە ناوازانەی کە پێکەوە کار دەکەن بۆ سەرخستنی ئامانجەکانمان.</p>
          </div>
          <div className="relative z-10 hidden md:block opacity-90 drop-shadow-lg">
            <Icon icon="fluent-emoji:handshake" width={96} />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-200/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => {
            const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));
            const colorClass = dept.color || 'bg-primary';
            
            return (
              <div 
                key={dept.id} 
                onClick={() => setSelectedDeptId(dept.id)}
                className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-neutral-100 cursor-pointer group flex flex-col items-center text-center relative overflow-hidden h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}></div>
                <div className={\`w-20 h-20 rounded-[24px] mb-6 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 \${colorClass.startsWith('#') || colorClass.startsWith('rgb') ? '' : colorClass}\`}
                     style={colorClass.startsWith('#') || colorClass.startsWith('rgb') ? { backgroundColor: colorClass } : {}}>
                  <Icon icon={dept.icon || "hugeicons:building-03"} width={36} />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-800 mb-3 group-hover:text-primary transition-colors">{dept.name}</h3>
                <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-50 text-neutral-600 rounded-full text-sm font-bold mt-auto border border-neutral-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                  <Icon icon="fluent-emoji:people-hugging" width={18} />
                  <span>{deptUsers.length} هاوڕێ لەم دەستەیەدان</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }`;

if (code.includes(target1)) {
  code = code.replace(target1, replace1);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('Success 1');
} else {
  console.log('Failed to find target 1');
}
