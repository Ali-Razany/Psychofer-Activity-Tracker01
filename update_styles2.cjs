const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// Action buttons
content = content.replace(
  'className="flex-1 md:flex-none px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 transition-colors h-[28px] md:h-auto"',
  'className="flex-1 md:flex-none px-2 py-0 md:px-4 md:py-2 text-[12px] md:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1 md:gap-2 transition-colors h-[23px] md:h-auto"'
);
content = content.replace(
  'className="flex-1 md:flex-none px-2 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 transition-colors h-[28px] md:h-auto"',
  'className="flex-1 md:flex-none px-2 py-0 md:px-4 md:py-2 text-[12px] md:text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1 md:gap-2 transition-colors h-[23px] md:h-auto"'
);

// Top button (Create task)
content = content.replace(
  'className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"',
  'className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-sm bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"'
);

// Step Circles
content = content.replace(
  'className={`w-[18px] h-[18px] md:w-8 md:h-8 text-[9px] md:text-sm rounded-full border-2 flex-none flex items-center justify-center',
  'className={`w-[19px] h-[19px] md:w-8 md:h-8 text-[9px] md:text-sm rounded-full border-2 flex-none flex items-center justify-center'
);

// Step text
content = content.replace(
  'className={`text-[9px] md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}',
  'className={`text-[10px] md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}'
);

// Step bottom margin on h3
content = content.replace(
  'className="h-8 flex items-center md:h-auto"',
  'className="h-8 flex items-center md:h-auto mb-3 md:mb-0"'
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
