const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Insert isGeneralSupervisor and display variables after userRank
content = content.replace(
  "  const userRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;",
  "  const userRank = sortedUsers.findIndex(u => u.id === currentUser.id) + 1;\n  const isGeneralSupervisor = currentUser.roles.includes('Admin');\n  const displayPoints = isGeneralSupervisor ? 0 : currentUser.points;\n  const displayRank = isGeneralSupervisor ? '-' : `#${userRank}`;\n  const displayPending = isGeneralSupervisor ? 0 : pendingLogs;\n  const displayApproved = isGeneralSupervisor ? 0 : approvedLogs;"
);

// Replace points references in chart data
content = content.replace(
  /Math.floor\(currentUser.points \*/g,
  "Math.floor(displayPoints *"
);

// Replace stats in the 4 cards
content = content.replace(
  "{currentUser.points}",
  "{displayPoints}"
);
content = content.replace(
  "#{userRank}",
  "{displayRank}"
);
content = content.replace(
  "{pendingLogs}",
  "{displayPending}"
);
content = content.replace(
  "{approvedLogs}",
  "{displayApproved}"
);

// Gamification section fixes
content = content.replace(
  "if (currentUser.points >= 50 && currentUser.points < 100) {",
  "if (displayPoints >= 50 && displayPoints < 100) {"
);
content = content.replace(
  "else if (currentUser.points >= 100 && currentUser.points < 500) {",
  "else if (displayPoints >= 100 && displayPoints < 500) {"
);
content = content.replace(
  "else if (currentUser.points >= 500) {",
  "else if (displayPoints >= 500) {"
);

content = content.replace(
  "const progressPercent = Math.min(100, Math.round((currentUser.points / nextMilestone) * 100));",
  "const progressPercent = Math.min(100, Math.round((displayPoints / nextMilestone) * 100));"
);

content = content.replace(
  "{nextMilestone - currentUser.points}",
  "{nextMilestone - displayPoints}"
);

// And for activities, in the Admin panel they have a different view maybe, but in Dashboard it shows:
// {activities.filter(a => (a.department || "") === (currentUser?.departments?.[0] || "")).slice(0, 4).map(task => (
// Let's replace the activities list for general supervisor to be empty or just handle it if they want 0 activities
content = content.replace(
  "activities.filter(a => (a.department || \"\") === (currentUser?.departments?.[0] || \"\"))",
  "activities.filter(a => !isGeneralSupervisor && (a.department || \"\") === (currentUser?.departments?.[0] || \"\"))"
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
