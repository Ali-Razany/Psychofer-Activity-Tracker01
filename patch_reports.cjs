const fs = require('fs');
let code = fs.readFileSync('src/components/Reports.tsx', 'utf8');

// Replace view mode buttons
code = code.replace(
  /className={\`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium/g,
  "className={`flex-1 md:flex-none px-2 sm:px-4 py-2 rounded-lg text-[12px] sm:text-sm font-medium whitespace-nowrap"
);

// We need to allow the container to overflow nicely or wrap.
code = code.replace(
  /<div className="flex gap-2 bg-surface-bg p-1 rounded-xl w-full md:w-auto">/,
  '<div className="flex gap-1 sm:gap-2 bg-surface-bg p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">'
);

// Replace filter buttons
code = code.replace(
  /<div className="flex bg-surface-border p-1 rounded-\[20px\] self-start">/,
  '<div className="flex flex-wrap gap-1 bg-surface-border p-1 rounded-[20px] self-start w-full md:w-auto">'
);

code = code.replace(
  /className={\`px-4 py-1.5 rounded-md text-sm font-medium transition-colors/g,
  "className={`px-2 sm:px-4 py-1.5 rounded-md text-[12px] sm:text-sm font-medium transition-colors flex-1 text-center"
);

fs.writeFileSync('src/components/Reports.tsx', code);
