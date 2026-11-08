const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetImport = `import { AnimatedTooltip } from './ui/animated-tooltip';`;
const replaceImport = `import { AnimatedTooltip } from './ui/animated-tooltip';\nimport Strands from './ui/Strands';`;

if (code.includes(targetImport)) {
  code = code.replace(targetImport, replaceImport);
}

const helper = `  const getStrandColors = (id: string) => {
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

const insertHelperTarget = `  const getGradientStyle = (department: DepartmentInfo) => {`;
if (code.includes(insertHelperTarget)) {
  code = code.replace(insertHelperTarget, helper + '\n\n' + insertHelperTarget);
}

const targetDiv = `<div className="h-40 relative" style={getGradientStyle(dept)}>`;
const replaceDiv = `<div className="h-40 relative" style={getGradientStyle(dept)}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
            <Strands 
              colors={getStrandColors(dept.id)}
              count={3}
              speed={0.5}
              amplitude={1}
              waviness={1}
              thickness={0.7}
              glow={2.6}
              taper={3}
              spread={1}
              intensity={0.6}
              saturation={1.5}
              opacity={0.7}
              scale={1.5}
              glass={false}
            />
          </div>`;

if (code.includes(targetDiv)) {
  code = code.replace(targetDiv, replaceDiv);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched depts strands');
} else {
  console.log('failed to find target div in depts');
}
