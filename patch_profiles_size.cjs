const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

code = code.replace(
  '<p className="text-neutral-500 mt-1">لێرەوە دەتوانیت پڕۆفایل و چالاکی سەرجەم ئەندامان ببینی.</p>',
  '<p className="text-[12px] text-neutral-500 mt-1">لێرەوە دەتوانیت پڕۆفایل و چالاکی سەرجەم ئەندامان ببینی.</p>'
);

code = code.replace(
  'className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-neutral-800"',
  'className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-neutral-800 text-[12px]"'
);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
