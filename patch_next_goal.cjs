const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(
  "let nextMilestone = 50;",
  "let nextMilestone = isGeneralSupervisor ? 0 : 50;"
);

content = content.replace(
  "let milestoneLabel = '٥٠ خاڵ';",
  "let milestoneLabel = isGeneralSupervisor ? '٠ خاڵ' : '٥٠ خاڵ';"
);

content = content.replace(
  "const progressPercent = Math.min(100, Math.round((displayPoints / nextMilestone) * 100));",
  "const progressPercent = isGeneralSupervisor ? 0 : Math.min(100, Math.round((displayPoints / nextMilestone) * 100));"
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
