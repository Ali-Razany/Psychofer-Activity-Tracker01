const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const helper = `  const getStrandColors = (userDeps?: string[]) => {
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
  };`;

const insertHelperTarget = `const getGradientStyle = (userDeps?: string[]) => {`;
if (code.includes(insertHelperTarget)) {
  code = code.replace(insertHelperTarget, helper + '\n\n  ' + insertHelperTarget);
}

const targetDiv = `<Strands 
                  colors={["#ffffff", "#f8fafc", "#e2e8f0"]}`;

const replaceDiv = `<Strands 
                  colors={getStrandColors(selectedUser.departments)}`;

if (code.includes(targetDiv)) {
  code = code.replace(targetDiv, replaceDiv);
}

fs.writeFileSync('src/components/ProfilesList.tsx', code);
console.log('patched profiles strands colors');
