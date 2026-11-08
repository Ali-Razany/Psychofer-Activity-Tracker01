const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const regexToRemove = /    const colors = userDeps\.map\(id => \{[\s\S]*?  \};\n\n  const getDeptColorInfo =/m;

if (regexToRemove.test(code)) {
  code = code.replace(regexToRemove, '  const getDeptColorInfo =');
  fs.writeFileSync('src/components/ProfilesList.tsx', code);
  console.log('fixed stray code');
} else {
  console.log('failed to find stray code');
}
