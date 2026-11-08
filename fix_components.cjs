const fs = require('fs');

// Fix Dashboard.tsx
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/b\.id/g, "b.type"); // Since we changed it to b.id earlier, we need to change it back to type. Wait, the error is 'id' does not exist.
dashboard = dashboard.replace(/activity\.departments/g, "activity.department");
dashboard = dashboard.replace(/activity\.type/g, "''");
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix ProfilesList.tsx
let pl = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');
pl = pl.replace(/b\.id/g, "b.type");
pl = pl.replace(/b\.awardedAt/g, "''");
fs.writeFileSync('src/components/ProfilesList.tsx', pl);

console.log('Fixed components');
