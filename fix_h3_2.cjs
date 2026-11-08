const fs = require('fs');
let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

content = content.replace(
  'className="h-8 flex items-center md:h-auto mb-3 md:mb-0"',
  'className="h-8 flex items-center md:h-auto mb-3 md:mb-0 pl-[14px] md:pl-0"'
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
