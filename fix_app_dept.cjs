const fs = require('fs');

let app = fs.readFileSync('src/components/Approvals.tsx', 'utf8');
app = app.replace(/task\?\.department === currentUser\.department/g, "currentUser.departments?.includes(task?.department || '')");
app = app.replace(/u\.departments\?\.\[0\] === currentUser\?\.departments\?\.\[0\]/g, "(u.departments || []).some(d => (currentUser?.departments || []).includes(d))");
fs.writeFileSync('src/components/Approvals.tsx', app);

console.log('Fixed app dept');
