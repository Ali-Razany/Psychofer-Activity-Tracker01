const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(/task\.type === 'Quantitative' && /g, "");
dash = dash.replace(/a\.department\[0\]/g, "a.department");
dash = dash.replace(/a\.department === \(currentUser\?\.departments\?\.\[0\] \|\| ""\)/g, "a.department === (currentUser?.departments?.[0] || '')");

fs.writeFileSync('src/components/Dashboard.tsx', dash);
console.log('Fixed dash 2');
