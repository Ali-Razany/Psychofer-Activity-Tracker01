const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// The top h3: "پڕۆسە و ڕاسپاردەکان"
content = content.replace(
  '<h3 className="font-bold text-sm md:text-lg text-neutral-900 flex items-center gap-2">',
  '<h3 className="font-bold text-[14px] md:text-lg text-neutral-900 flex items-center gap-2">'
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
