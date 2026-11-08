import fs from 'fs';

let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const target = `                } • {departments.find(d => d.id === currentUser.department)?.name || currentUser.department}
              </p>`;
const replacement = `                } • {departments.find(d => d.id === currentUser.department)?.name || currentUser.department}
                {currentUser.jobTitle && <span className="block mt-0.5 text-blue-600 font-medium">{currentUser.jobTitle}</span>}
              </p>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Layout.tsx', code);
