const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(
  'className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl bg-surface-paper"',
  'className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto"'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
