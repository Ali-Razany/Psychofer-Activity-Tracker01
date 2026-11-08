const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(
  'activities.filter(a => (a.department || "") === (currentUser?.departments?.[0] || "")).length === 0',
  'activities.filter(a => !isGeneralSupervisor && (a.department || "") === (currentUser?.departments?.[0] || "")).length === 0'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
