const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Replace useAppContext
content = content.replace(
  'const { currentUser, users, logs, departments, activities, setViewProfileId } = useAppContext();',
  'const { currentUser, users, logs, departments, activities, customBadges, setViewProfileId } = useAppContext();'
);

// Remove BADGE_INFO import
content = content.replace("import { BADGE_INFO } from '../lib/badges';", "");

// Replace usage in Dashboard
content = content.replace(
  'const info = BADGE_INFO[b.type];',
  'const info = customBadges.find(cb => cb.id === b.type);'
);

// We need to patch the type of setViewBadgeDetails if it complains
// Let's check where setViewBadgeDetails is defined in Dashboard
fs.writeFileSync('src/components/Dashboard.tsx', content);
