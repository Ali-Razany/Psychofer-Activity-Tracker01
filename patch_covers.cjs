const fs = require('fs');
let deptsCode = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');
let profilesCode = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

// DEPARTMENTS LIST UPDATES

const deptStrandHelperOld = `  const getStrandColors = (id: string) => {
    switch (id) {
      case 'd-1': return ['#059669', '#10b981', '#34d399', '#ffffff']; // emerald
      case 'd-2': return ['#6d28d9', '#8b5cf6', '#a78bfa', '#ffffff']; // violet
      case 'd-3': return ['#d97706', '#f59e0b', '#fbbf24', '#ffffff']; // amber
      case 'd-4': return ['#be185d', '#ec4899', '#f472b6', '#ffffff']; // pink
      case 'd-5': return ['#0369a1', '#0ea5e9', '#38bdf8', '#ffffff']; // sky
      case 'd-6': return ['#be123c', '#f43f5e', '#fb7185', '#ffffff']; // rose
      default: return ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff']; // primary
    }
  };

  const getGradientStyle = (department: DepartmentInfo) => {
    const id = department.id;
    const c = department.color;
    if (c) {
      if (c.startsWith('#') || c.startsWith('rgb')) {
         return { background: \`linear-gradient(135deg, \${c} 0%, \${c}80 100%)\` };
      }
    }
    switch (id) {
      case 'd-1': return { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' };
      case 'd-2': return { background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' };
      case 'd-3': return { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' };
      case 'd-4': return { background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' };
      case 'd-5': return { background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)' };
      case 'd-6': return { background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' };
      default: return { background: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)' };
    }
  };`;

const newDeptHelpers = `  const getDeptColorInfo = (dept?: DepartmentInfo) => {
    if (!dept) return { bg: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)', strands: ['#94a3b8', '#cbd5e1', '#e2e8f0'] };
    const name = dept.name || '';
    
    if (name.includes('ڕاگەیاندن')) return { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', strands: ['#047857', '#10b981', '#6ee7b7', '#ffffff'] }; // Green
    if (name.includes('نەخشەسازی') || name.includes('دیزاین')) return { bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', strands: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'] }; // Blue
    if (name.includes('دۆبلاژ')) return { bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', strands: ['#6d28d9', '#8b5cf6', '#c4b5fd', '#ffffff'] }; // Violet
    if (name.includes('وەرگێڕان')) return { bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', strands: ['#c2410c', '#f97316', '#fdba74', '#ffffff'] }; // Orange
    if (name.includes('پێداچوونەوە')) return { bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)', strands: ['#be185d', '#ec4899', '#fbcfe8', '#ffffff'] }; // Pink
    if (name.includes('تایپ')) return { bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', strands: ['#0f766e', '#14b8a6', '#5eead4', '#ffffff'] }; // Teal
    if (name.includes('ئایتی') || name.includes('IT')) return { bg: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', strands: ['#4338ca', '#6366f1', '#a5b4fc', '#ffffff'] }; // Indigo
    
    // Fallback based on custom color or default
    const c = dept.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb'))) {
       return { bg: \`linear-gradient(135deg, \${c} 0%, \${c}80 100%)\`, strands: [c, '#ffffff'] };
    }
    
    return { bg: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)', strands: ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff'] };
  };`;

deptsCode = deptsCode.replace(deptStrandHelperOld, newDeptHelpers);

const deptDivOld = `<div className="h-40 relative" style={getGradientStyle(dept)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Strands 
              colors={getStrandColors(dept.id)}
              count={4}
              speed={0.5}
              amplitude={1.5}
              waviness={1}
              thickness={1}
              glow={2.8}
              taper={1}
              spread={1.5}
              intensity={0.7}
              saturation={1.5}
              opacity={0.8}
              scale={2.2}
              glass={false}
            />
          </div>`;

const deptDivNew = `<div className="h-40 relative" style={{ background: getDeptColorInfo(dept).bg }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '120px', overflow: 'hidden' }}>
            <Strands 
              colors={getDeptColorInfo(dept).strands}
              count={3}
              speed={0.5}
              amplitude={1.5}
              waviness={1}
              thickness={1}
              glow={2}
              taper={2}
              spread={1}
              intensity={0.6}
              saturation={1.2}
              opacity={0.8}
              scale={1.5}
              glass={false}
            />
          </div>`;

deptsCode = deptsCode.replace(deptDivOld, deptDivNew);

const deptAvatarOld = `<div className="p-1 rounded-full shadow-lg" style={getGradientStyle(dept)}>`;
const deptAvatarNew = `<div className="p-1 rounded-full shadow-lg" style={{ background: getDeptColorInfo(dept).bg }}>`;
deptsCode = deptsCode.replace(deptAvatarOld, deptAvatarNew);

fs.writeFileSync('src/components/DepartmentsList.tsx', deptsCode);


// PROFILES LIST UPDATES

const profStrandHelperOld = `  const getStrandColors = (userDeps?: string[]) => {
    if (!userDeps || userDeps.length === 0) return ['#94a3b8', '#cbd5e1', '#e2e8f0'];
    const id = userDeps[0];
    switch (id) {
      case 'd-1': return ['#059669', '#10b981', '#34d399', '#ffffff']; // emerald
      case 'd-2': return ['#6d28d9', '#8b5cf6', '#a78bfa', '#ffffff']; // violet
      case 'd-3': return ['#d97706', '#f59e0b', '#fbbf24', '#ffffff']; // amber
      case 'd-4': return ['#be185d', '#ec4899', '#f472b6', '#ffffff']; // pink
      case 'd-5': return ['#0369a1', '#0ea5e9', '#38bdf8', '#ffffff']; // sky
      case 'd-6': return ['#be123c', '#f43f5e', '#fb7185', '#ffffff']; // rose
      default: return ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff']; // primary
    }
  };

  const getGradientStyle = (userDeps?: string[]) => {
    if (!userDeps || userDeps.length === 0) return { background: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)' };
    const colors = userDeps.map(id => {
      const c = departments.find(d => d.id === id)?.color;
      return c && (c.startsWith('#') || c.startsWith('rgb')) ? c : '#546FFF';
    });
    if (colors.length === 1) {
      return { background: \`linear-gradient(135deg, \${colors[0]} 0%, \${colors[0]}80 100%)\` };
    }
    return { background: \`linear-gradient(135deg, \${colors.join(', ')})\` };
  };`;

const newProfHelpers = `  const getDeptColorInfo = (userDeps?: string[]) => {
    if (!userDeps || userDeps.length === 0) return { bg: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)', strands: ['#94a3b8', '#cbd5e1', '#e2e8f0'] };
    const id = userDeps[0];
    const dept = departments.find(d => d.id === id);
    const name = dept?.name || '';
    
    if (name.includes('ڕاگەیاندن')) return { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', strands: ['#047857', '#10b981', '#6ee7b7', '#ffffff'] }; // Green
    if (name.includes('نەخشەسازی') || name.includes('دیزاین')) return { bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', strands: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'] }; // Blue
    if (name.includes('دۆبلاژ')) return { bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', strands: ['#6d28d9', '#8b5cf6', '#c4b5fd', '#ffffff'] }; // Violet
    if (name.includes('وەرگێڕان')) return { bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', strands: ['#c2410c', '#f97316', '#fdba74', '#ffffff'] }; // Orange
    if (name.includes('پێداچوونەوە')) return { bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)', strands: ['#be185d', '#ec4899', '#fbcfe8', '#ffffff'] }; // Pink
    if (name.includes('تایپ')) return { bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', strands: ['#0f766e', '#14b8a6', '#5eead4', '#ffffff'] }; // Teal
    if (name.includes('ئایتی') || name.includes('IT')) return { bg: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', strands: ['#4338ca', '#6366f1', '#a5b4fc', '#ffffff'] }; // Indigo
    
    // Fallback based on custom color or default
    const c = dept?.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb'))) {
       return { bg: \`linear-gradient(135deg, \${c} 0%, \${c}80 100%)\`, strands: [c, '#ffffff'] };
    }
    
    return { bg: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)', strands: ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff'] };
  };

  const getGradientStyle = (userDeps?: string[]) => {
    return { background: getDeptColorInfo(userDeps).bg };
  };`;

profilesCode = profilesCode.replace(profStrandHelperOld, newProfHelpers);

const profDivOld = `<div className="h-40 relative" style={getGradientStyle(selectedUser.departments)}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                <Strands 
                  colors={getStrandColors(selectedUser.departments)}
                  count={4}
                  speed={0.5}
                  amplitude={1.5}
                  waviness={1}
                  thickness={1}
                  glow={2.8}
                  taper={1}
                  spread={1.5}
                  intensity={0.7}
                  saturation={1.5}
                  opacity={0.8}
                  scale={2.2}
                  glass={false}
                />
              </div>`;

const profDivNew = `<div className="h-40 relative" style={{ background: getDeptColorInfo(selectedUser.departments).bg }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '120px', overflow: 'hidden' }}>
                <Strands 
                  colors={getDeptColorInfo(selectedUser.departments).strands}
                  count={3}
                  speed={0.5}
                  amplitude={1.5}
                  waviness={1}
                  thickness={1}
                  glow={2}
                  taper={2}
                  spread={1}
                  intensity={0.6}
                  saturation={1.2}
                  opacity={0.8}
                  scale={1.5}
                  glass={false}
                />
              </div>`;

profilesCode = profilesCode.replace(profDivOld, profDivNew);

fs.writeFileSync('src/components/ProfilesList.tsx', profilesCode);

console.log('patched both covers');
