import fs from 'fs';

let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = `<div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                  {user.name.charAt(0)}
                </div>`;
const replacement = `{user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                ) : (
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {user.name.charAt(0)}
                  </div>
                )}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Dashboard.tsx', code);
