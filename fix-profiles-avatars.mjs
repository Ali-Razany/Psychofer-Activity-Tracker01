import fs from 'fs';

let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const target1 = `<div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl border-2 border-white/20 shadow-sm shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>`;
const new1 = `{selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/20 shadow-sm shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-2xl border-2 border-white/20 shadow-sm shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}`;

const target2 = `<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
              <UserIcon size={24} />
            </div>`;
const new2 = `{user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border border-slate-200 shadow-sm" />
            ) : (
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                <UserIcon size={24} />
              </div>
            )}`;

code = code.replace(target1, new1);
code = code.replace(target2, new2);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
