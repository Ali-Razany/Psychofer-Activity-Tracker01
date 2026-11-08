import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetRender = `<span className="font-bold text-slate-800">{u.name}</span>`;
const newRender = `<span className="font-bold text-slate-800">{u.name}</span>
                  {u.jobTitle && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-2">{u.jobTitle}</span>}`;

code = code.replace(targetRender, newRender);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
