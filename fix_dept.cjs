const fs = require('fs');

let af = fs.readFileSync('src/components/ActivityForm.tsx', 'utf8');
af = af.replace(/currentUser\?\.department/g, "currentUser?.departments?.[0]");
fs.writeFileSync('src/components/ActivityForm.tsx', af);

let app = fs.readFileSync('src/components/Approvals.tsx', 'utf8');
app = app.replace(/currentUser\?\.department/g, "currentUser?.departments?.[0]");
app = app.replace(/u\.department/g, "u.departments?.[0]");
fs.writeFileSync('src/components/Approvals.tsx', app);

console.log('Fixed department');
