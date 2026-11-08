const fs = require('fs');

let about = fs.readFileSync('src/components/About.tsx', 'utf8');

// 1. Remove avatar filter
about = about.replace(
  "const team = users.filter(u => u.avatar && u.avatar.trim() !== '');",
  "const team = users;"
);

// 2. Add avatar fallback
about = about.replace(
  '<img\n                        src={user.avatar}',
  '{user.avatar ? (\n                      <img\n                        src={user.avatar}'
);

about = about.replace(
  'alt={user.name}\n                      />\n                    </div>',
  'alt={user.name}\n                      />\n                    ) : (\n                      <div className="w-full h-full bg-surface-bg flex items-center justify-center text-4xl font-bold text-neutral-400">\n                        {user.name.charAt(0)}\n                      </div>\n                    )}\n                    </div>'
);

fs.writeFileSync('src/components/About.tsx', about);
