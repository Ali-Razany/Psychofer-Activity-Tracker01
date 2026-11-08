const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const regexToRemove = /  const getGradientStyle = \(department: DepartmentInfo\) => \{[\s\S]*?    \}[\s\S]*?  \};\n/;

code = code.replace(regexToRemove, '');

const toInsertTop = `  const getGradientStyle = (department: DepartmentInfo) => {
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
  };\n\n`;

const targetTop = `export function DepartmentsList({ onNavigate }: { onNavigate?: (tab: string) => void }) {\n`;

code = code.replace(targetTop, targetTop + toInsertTop);

fs.writeFileSync('src/components/DepartmentsList.tsx', code);
console.log('fixed getGradientStyle placement');
