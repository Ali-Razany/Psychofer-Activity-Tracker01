const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetHeader = `      {/* Header Cover Area */}
      <div className="relative">
        <button 
          onClick={() => setSelectedDeptId(null)}
          className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-neutral-800 hover:bg-white hover:scale-105 transition-all shadow-sm"
        >
          <Icon icon="solar:arrow-right-linear" width={24} />
        </button>
        {canEditDept(dept.id) && (
          <button 
            onClick={() => setEditingDept(dept)}
            className="absolute top-6 left-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-neutral-800 hover:bg-white hover:scale-105 transition-all shadow-sm"
            title="دەستکاری دەستە"
          >
            <Icon icon="solar:pen-new-square-linear" width={22} />
          </button>
        )}
        <div className={\`h-64 md:h-80 w-full rounded-[36px] overflow-hidden relative shadow-sm \${isCustomColor ? '' : colorClass}\`}
             style={isCustomColor ? { backgroundColor: colorClass } : {}}>
          {/* Subtle patterns */}
          <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
          
          <div className="absolute -bottom-16 -right-16 text-white/10 pointer-events-none transform -rotate-12"> 
            <Icon icon={dept.icon || "solar:buildings-bold-duotone"} width={320} />
          </div>
        </div>

        {/* Profile Card overlapping the cover */}
        <div className="px-6 md:px-12 -mt-24 relative z-10 flex flex-col md:flex-row md:items-end gap-6">
          <div className={\`w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-8 border-surface-bg shadow-xl flex items-center justify-center text-white \${isCustomColor ? '' : colorClass}\`}
               style={isCustomColor ? { backgroundColor: colorClass } : {}}>
            <Icon icon={dept.icon || "solar:buildings-bold-duotone"} className="w-16 h-16 md:w-20 md:h-20" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">{dept.name}</h1>
            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-sm font-bold">
                <Icon icon="solar:users-group-rounded-bold" width={18} className="text-neutral-500" />
                <span>{deptUsers.length} ئەندام</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;

const replaceHeader = `      {/* Header Cover Area */}
      <div className="bg-surface-paper overflow-hidden shadow-sm border border-neutral-100 rounded-3xl w-full mb-8 relative">
        <div className="h-40 relative" style={getGradientStyle(dept)}>
          <button 
            onClick={() => setSelectedDeptId(null)}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-neutral-700"
          >
            <Icon icon="solar:arrow-right-linear" width={22} />
          </button>
          {canEditDept(dept.id) && (
            <button 
              onClick={() => setEditingDept(dept)}
              className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2.5 rounded-full shadow backdrop-blur-sm transition-all z-20 text-primary"
              title="دەستکاری دەستە"
            >
              <Icon icon="solar:pen-new-square-linear" width={22} />
            </button>
          )}
        </div>
        
        <div className="flex justify-center -mt-16 relative z-10">
          <div className="p-1 rounded-full shadow-lg" style={getGradientStyle(dept)}>
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Icon icon={dept.icon || "solar:buildings-bold-duotone"} width={64} className="drop-shadow-md" />
            </div>
          </div>
        </div>

        <div className="text-center px-4 pt-4 pb-8 relative z-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">{dept.name}</h1>
          <div className="flex justify-center mt-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
              <Icon icon="solar:users-group-rounded-bold" width={16} />
              {deptUsers.length} ئەندام
            </span>
          </div>
        </div>
      </div>`;

if (code.includes(targetHeader)) {
  code = code.replace(targetHeader, replaceHeader);

  // Add getGradientStyle inside the Detailed Department Page logic
  const gradientHelper = `
  const getGradientStyle = (department: DepartmentInfo) => {
    const id = department.id;
    const c = department.color;
    if (c) {
      if (c.startsWith('#') || c.startsWith('rgb')) {
         return { background: \`linear-gradient(135deg, \${c} 0%, \${c}80 100%)\` };
      }
    }
    // Colorful fallbacks if no custom color
    switch (id) {
      case 'd-1': return { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }; // emerald
      case 'd-2': return { background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }; // violet
      case 'd-3': return { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }; // amber
      case 'd-4': return { background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }; // pink
      case 'd-5': return { background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' }; // sky
      case 'd-6': return { background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' }; // rose
      default: return { background: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)' }; // primary
    }
  };
`;

  const insertAfter = `const deptUsers = users.filter(u => (u.departments || []).includes(dept.id));`;
  code = code.replace(insertAfter, insertAfter + gradientHelper);

  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched header');
} else {
  console.log('failed to find header target');
}
