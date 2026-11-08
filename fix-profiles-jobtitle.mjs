import fs from 'fs';

let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const target1 = `{getRoleName(selectedUser.role)} • {departments.find(d => d.id === selectedUser.department)?.name || selectedUser.department}`;
const new1 = `{getRoleName(selectedUser.role)} • {departments.find(d => d.id === selectedUser.department)?.name || selectedUser.department}
                    {selectedUser.jobTitle && <span className="mr-2 px-2 py-0.5 bg-white/20 rounded-md text-xs">{selectedUser.jobTitle}</span>}`;

const target2 = `<div>
                  <label className="text-sm font-normal text-slate-500">پلە:</label>
                  <p className="text-sm text-slate-900 mt-1 font-medium">{getRoleName(selectedUser.role)}</p>
                </div>`;
const new2 = target2 + `
                {selectedUser.jobTitle && (
                  <div>
                    <label className="text-sm font-normal text-slate-500">پیشە:</label>
                    <p className="text-sm text-slate-900 mt-1 font-medium">{selectedUser.jobTitle}</p>
                  </div>
                )}`;

const target3 = `{getRoleName(user.role)} • {departments.find(d => d.id === user.department)?.name || user.department}`;
const new3 = `{getRoleName(user.role)} • {departments.find(d => d.id === user.department)?.name || user.department} {user.jobTitle && <span className="block mt-1 text-slate-400 font-medium">{user.jobTitle}</span>}`;

code = code.replace(target1, new1);
code = code.replace(target2, new2);
code = code.replace(target3, new3);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
