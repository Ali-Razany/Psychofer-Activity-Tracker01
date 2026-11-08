const fs = require('fs');
let content = fs.readFileSync('src/store/AppContext.tsx', 'utf8');
content = content.replace(
  'let unsubActs: any;',
  'let unsubActs: any;\n    let unsubBadges: any;'
);
fs.writeFileSync('src/store/AppContext.tsx', content);
