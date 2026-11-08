const fs = require('fs');
let content = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

// Replace useAppContext
content = content.replace(
  'const { users, departments, logs, currentUser, awardBadge, activities, viewProfileId, setViewProfileId } = useAppContext();',
  'const { users, departments, logs, currentUser, awardBadge, activities, customBadges, viewProfileId, setViewProfileId } = useAppContext();'
);

// Remove BADGE_INFO import
content = content.replace("import { BADGE_INFO } from '../lib/badges';", "");

// Replace usage in ProfilesList
content = content.replace(
  /const info = BADGE_INFO\[b\.type\];/g,
  'const info = customBadges.find(cb => cb.id === b.type);'
);

// Replace mapping Object.entries(BADGE_INFO)
content = content.replace(
  "Object.entries(BADGE_INFO).filter(([k]) => !k.startsWith('milestone_')).map(([key, info]) => {",
  "customBadges.filter(b => !b.id.startsWith('milestone_')).map((info) => {\n                  const key = info.id;"
);

fs.writeFileSync('src/components/ProfilesList.tsx', content);
