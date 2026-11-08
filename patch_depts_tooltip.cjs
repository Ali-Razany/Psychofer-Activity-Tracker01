const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const targetImport = `import { DepartmentInfo } from '../types';`;
const replaceImport = `import { DepartmentInfo } from '../types';\nimport { AnimatedTooltip } from './ui/animated-tooltip';`;

if (code.includes(targetImport)) {
  code = code.replace(targetImport, replaceImport);
}

const targetSection = `<div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {deptUsers.map(u => (
                  <div 
                    key={u.id} 
                    className="flex flex-col items-center flex-shrink-0 cursor-pointer snap-center group w-28"
                    onClick={() => {
                      setSelectedUser(u);
                      setEditBioText(u.bio || '');
                      setIsEditingBio(false);
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-indigo-50 border-[3px] border-white shadow-sm overflow-hidden mb-3 group-hover:border-primary group-hover:scale-105 transition-all duration-300">
                      <img src={u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`} alt={u.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-neutral-800 text-center line-clamp-1 w-full px-1 group-hover:text-primary transition-colors" title={u.name}>
                      {u.name}
                    </span>
                    <span className="text-xs font-medium text-neutral-500 mt-1 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {u.roles?.includes('Supervisor') ? 'سەرپەرشتیار' : 'ئەندام'}
                    </span>
                  </div>
                ))}
              </div>`;

const replaceSection = `<div className="flex flex-row items-center justify-center w-full rtl:flex-row-reverse flex-wrap gap-y-4 py-8">
                <AnimatedTooltip 
                  items={deptUsers.map((u) => ({
                    id: u.id,
                    name: u.name,
                    designation: u.roles?.includes('Supervisor') ? 'سەرپەرشتیار' : 'ئەندام',
                    image: u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`,
                    user: u
                  }))} 
                  onItemClick={(u) => {
                    setSelectedUser(u);
                    setEditBioText(u.bio || '');
                    setIsEditingBio(false);
                  }}
                />
              </div>`;

if (code.includes(targetSection)) {
  code = code.replace(targetSection, replaceSection);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched successfully');
} else {
  console.log('failed to find target section');
}
