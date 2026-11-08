const fs = require('fs');
let code = fs.readFileSync('src/components/ChromaGrid.tsx', 'utf8');

// Container
code = code.replace(
  'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"',
  'className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 relative z-10"'
);

// Card Padding
code = code.replace(
  'className="relative z-10 p-6 flex flex-col items-center text-center h-full"',
  'className="relative z-10 p-3 sm:p-6 flex flex-col items-center text-center h-full"'
);

// Image size
code = code.replace(
  'className="w-24 h-24 rounded-full p-1 mb-4"',
  'className="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-1 mb-2 sm:mb-4"'
);

code = code.replace(
  '<Icon icon="hugeicons:user" width={40} className="text-neutral-400" />',
  '<Icon icon="hugeicons:user" className="text-[24px] sm:text-[40px] text-neutral-400" />'
);

// Titles
code = code.replace(
  '<h3 className="text-[14px] md:text-lg font-bold text-neutral-800">{item.title}</h3>',
  '<h3 className="text-[12px] sm:text-[14px] md:text-lg font-bold text-neutral-800 line-clamp-1">{item.title}</h3>'
);

code = code.replace(
  '<p className="text-[12px] sm:text-sm font-medium text-neutral-500 mb-1">{item.subtitle}</p>',
  '<p className="text-[10px] sm:text-[12px] md:text-sm font-medium text-neutral-500 mb-1 line-clamp-1">{item.subtitle}</p>'
);

code = code.replace(
  '<p className="text-xs text-neutral-400 mb-4">{item.handle}</p>',
  '<p className="text-[10px] sm:text-xs text-neutral-400 mb-2 sm:mb-4 line-clamp-1">{item.handle}</p>'
);

// Bottom badges
code = code.replace(
  '<div className="mt-auto flex items-center gap-3 pt-4">',
  '<div className="mt-auto flex items-center justify-center gap-1 sm:gap-3 pt-2 sm:pt-4 flex-wrap">'
);

code = code.replace(
  'className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[12px] sm:text-sm font-bold border border-amber-200"',
  'className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold border border-amber-200"'
);

code = code.replace(
  '<Icon icon="hugeicons:star" width={16} />',
  '<Icon icon="hugeicons:star" className="text-[12px] sm:text-[16px]" />'
);

code = code.replace(
  'className="flex items-center gap-1 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-[12px] sm:text-sm font-bold border border-pink-200"',
  'className="flex items-center gap-0.5 sm:gap-1 bg-pink-50 text-pink-700 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-bold border border-pink-200"'
);

code = code.replace(
  '<Icon icon="hugeicons:rosette-discount-check" width={16} />',
  '<Icon icon="hugeicons:rosette-discount-check" className="text-[12px] sm:text-[16px]" />'
);

fs.writeFileSync('src/components/ChromaGrid.tsx', code);
