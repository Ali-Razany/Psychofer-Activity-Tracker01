const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

// For list view:
code = code.replace(
  "{dept} • {role}",
  "{dept ? `${dept} • ${role}` : role}"
);

// For grid view:
// subtitle is empty string, which is fine, it will just not show subtitle.
// Let's check how GridCard is implemented if we can.
// But mostly the list view was `{dept} • {role}`.

fs.writeFileSync('src/components/ProfilesList.tsx', code);
