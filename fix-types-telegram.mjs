import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  /email\?: string;\n  avatar\?: string;/,
  "email?: string;\n  avatar?: string;\n  telegramChatId?: string;"
);

fs.writeFileSync('src/types.ts', code);
