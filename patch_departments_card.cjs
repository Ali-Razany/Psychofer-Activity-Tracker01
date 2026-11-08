const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

// Modify the card content to be responsive for smaller width in mobile
code = code.replace(
  'className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-neutral-100 cursor-pointer group flex flex-col relative overflow-hidden h-full"',
  'className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-neutral-100 cursor-pointer group flex flex-col relative overflow-hidden h-full"'
);

code = code.replace(
  'className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 ${isCustomColor ? \'\' : colorClass}`}',
  'className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] shrink-0 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3 ${isCustomColor ? \'\' : colorClass}`}'
);

code = code.replace(
  '<Icon icon={dept.icon || "solar:buildings-bold-duotone"} width={28} />',
  '<Icon icon={dept.icon || "solar:buildings-bold-duotone"} className="text-[20px] sm:text-[28px]" />'
);

code = code.replace(
  'className="text-[14px] md:text-xl font-extrabold text-neutral-800 mb-3 group-hover:text-primary transition-colors relative z-10"',
  'className="text-[12px] sm:text-[14px] md:text-xl font-extrabold text-neutral-800 mb-2 sm:mb-3 group-hover:text-primary transition-colors relative z-10 line-clamp-1"'
);

code = code.replace(
  'className="text-neutral-500 text-[12px] sm:text-sm leading-relaxed line-clamp-3 mb-6 relative z-10 flex-grow"',
  'className="text-neutral-500 text-[10px] sm:text-[12px] md:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 relative z-10 flex-grow"'
);

code = code.replace(
  'className="mt-auto pt-4 border-t border-neutral-100 flex items-center text-primary font-bold text-[12px] sm:text-sm relative z-10 group-hover:gap-2 transition-all"',
  'className="mt-auto pt-2 sm:pt-4 border-t border-neutral-100 flex items-center text-primary font-bold text-[10px] sm:text-sm relative z-10 group-hover:gap-2 transition-all"'
);

fs.writeFileSync('src/components/DepartmentsList.tsx', code);
