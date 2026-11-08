const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// Title size (was text-base md:text-lg)
content = content.replace(
  'className="font-bold text-neutral-800 text-base md:text-lg mb-1 md:mb-2"',
  'className="font-bold text-neutral-800 text-[13px] md:text-lg mb-1 md:mb-2"'
);

// Desc size (was text-xs md:text-sm)
content = content.replace(
  'className="text-neutral-500 text-xs md:text-sm mb-3 md:mb-4"',
  'className="text-neutral-500 text-[10px] md:text-sm mb-2 md:mb-4 leading-tight md:leading-normal"'
);

// Tags
content = content.replace(
  'className="flex flex-wrap items-center gap-2 text-xs"',
  'className="flex flex-wrap items-center gap-2"'
);
content = content.replace(
  'className="bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium"',
  'className="bg-neutral-100 text-neutral-600 px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 font-medium text-[10px] md:text-xs"'
);

// Card padding and gap
content = content.replace(
  'className="p-4 md:p-6 border border-surface-border rounded-[24px] bg-white shadow-sm flex flex-col gap-4 md:gap-6 w-full overflow-hidden"',
  'className="p-3 md:p-6 border border-surface-border rounded-[16px] md:rounded-[24px] bg-white shadow-sm flex flex-col gap-3 md:gap-6 w-full overflow-hidden"'
);

// Action Buttons
content = content.replace(
  'className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"',
  'className="flex-1 md:flex-none px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 transition-colors h-[28px] md:h-auto"'
);
content = content.replace(
  'className="flex-1 md:flex-none px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"',
  'className="flex-1 md:flex-none px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 transition-colors h-[28px] md:h-auto"'
);

// Steps Circle
content = content.replace(
  'className={`w-6 h-6 md:w-8 md:h-8 text-xs md:text-sm rounded-full border-2 flex-none flex items-center justify-center',
  'className={`w-[18px] h-[18px] md:w-8 md:h-8 text-[9px] md:text-sm rounded-full border-2 flex-none flex items-center justify-center'
);

// Steps Checkmark
content = content.replace(
  'className="w-3.5 h-3.5 md:w-5 md:h-5 text-white"',
  'className="w-2.5 h-2.5 md:w-5 md:h-5 text-white"'
);

// Steps Text
content = content.replace(
  'className={`text-xs md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}',
  'className={`text-[9px] md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}'
);

// Drop the line linking circles to be thinner/smaller on mobile
content = content.replace(
  'className="w-4 h-4 md:w-5 md:h-5 text-gray-500"',
  'className="w-3 h-3 md:w-5 md:h-5 text-gray-500"'
);
content = content.replace(
  'className="w-4 h-4 md:w-5 md:h-5 mx-auto text-gray-500 rtl:rotate-180"',
  'className="w-3 h-3 md:w-5 md:h-5 mx-auto text-gray-500 rtl:rotate-180"'
);
content = content.replace(
  'className={`h-8 flex items-center md:hidden',
  'className={`h-4 flex items-center md:hidden'
);

// Make the list item tighter
content = content.replace(
  'className="flex-1 last:flex-none flex md:items-center min-w-[100px] md:min-w-[120px]"',
  'className="flex-1 last:flex-none flex md:items-center min-w-[70px] md:min-w-[120px]"'
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
