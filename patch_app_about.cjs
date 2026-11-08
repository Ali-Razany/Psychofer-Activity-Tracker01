const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importAbout = `import { About } from './components/About';\n`;
if (!code.includes('About')) {
  code = code.replace("import { AdminPanel } from './components/AdminPanel';", "import { AdminPanel } from './components/AdminPanel';\n" + importAbout);
}

const targetCase = `case 'admin': return <AdminPanel />;`;
const newCase = `case 'admin': return <AdminPanel />;\n      case 'about': return <About />;`;

if (code.includes(targetCase)) {
  code = code.replace(targetCase, newCase);
  fs.writeFileSync('src/App.tsx', code);
  console.log('patched app');
} else {
  console.log('failed to patch app');
}
