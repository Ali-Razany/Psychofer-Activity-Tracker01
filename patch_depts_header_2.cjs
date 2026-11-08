const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const regex = /\{\/\* Header Cover Area \*\/\}[\s\S]*?(?=<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">)/;

const replaceHeader = `{/* Header Cover Area */}
      <div className="bg-surface-paper overflow-hidden shadow-sm border border-neutral-100 rounded-[32px] w-full mb-8 relative">
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
      </div>
      
      `;

if (regex.test(code)) {
  code = code.replace(regex, replaceHeader);

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
  console.log('patched header 2');
} else {
  console.log('failed to find header target regex');
}
