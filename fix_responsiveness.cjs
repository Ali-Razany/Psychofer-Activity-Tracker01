const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// Container
content = content.replace(
  'className="p-6 border border-surface-border rounded-[24px] bg-white shadow-sm flex flex-col gap-6 w-full overflow-hidden"',
  'className="p-4 md:p-6 border border-surface-border rounded-[24px] bg-white shadow-sm flex flex-col gap-4 md:gap-6 w-full overflow-hidden"'
);

// Title
content = content.replace(
  'className="font-bold text-neutral-800 text-lg mb-2"',
  'className="font-bold text-neutral-800 text-base md:text-lg mb-1 md:mb-2"'
);

// Desc
content = content.replace(
  'className="text-neutral-500 text-sm mb-4"',
  'className="text-neutral-500 text-xs md:text-sm mb-3 md:mb-4"'
);

// Buttons
content = content.replace(
  'className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"',
  'className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"'
);
content = content.replace(
  'className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"',
  'className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"'
);

// Steps sizes
content = content.replace(
  'className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center',
  'className={`w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm rounded-full border-2 flex-none flex items-center justify-center'
);

content = content.replace(
  'className="w-5 h-5 text-white"',
  'className="w-3.5 h-3.5 md:w-5 md:h-5 text-white"'
);

content = content.replace(
  'className={`h-12 flex items-center md:hidden',
  'className={`h-8 flex items-center md:hidden'
);

content = content.replace(
  'className={`text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}',
  'className={`text-xs md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}'
);

content = content.replace(
  'className="w-5 h-5 text-gray-500"',
  'className="w-4 h-4 md:w-5 md:h-5 text-gray-500"'
);

content = content.replace(
  'className="w-5 h-5 mx-auto text-gray-500 rtl:rotate-180"',
  'className="w-4 h-4 md:w-5 md:h-5 mx-auto text-gray-500 rtl:rotate-180"'
);

// Decrease min-w from 120px to 100px on mobile
content = content.replace(
  'className="flex-1 last:flex-none flex md:items-center min-w-[120px]"',
  'className="flex-1 last:flex-none flex md:items-center min-w-[100px] md:min-w-[120px]"'
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
