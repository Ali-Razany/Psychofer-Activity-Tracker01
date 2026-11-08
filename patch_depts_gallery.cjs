const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const importStatement = `import { DepartmentInfo } from '../types';\nimport CircularGallery from './CircularGallery';`;
code = code.replace(`import { DepartmentInfo } from '../types';`, importStatement);

const target = `{/* Right Column: Members */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon icon="solar:users-group-two-rounded-bold-duotone" width={22} />
            </div>
            ئەندامەکانی دەستە
          </h3>
          
          <div className="space-y-3">
            {deptUsers.map(user => (
              <div 
                key={user.id} 
                className="bg-white p-4 rounded-[24px] border border-neutral-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all group"
                onClick={() => {
                  if (onNavigate) {
                    setViewProfileId(user.id);
                    onNavigate('profiles');
                  }
                }}
              >
                <div className="w-12 h-12 rounded-full bg-neutral-100 shrink-0 relative overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-800 text-sm truncate group-hover:text-primary transition-colors">{user.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">{getRoleName(user.roles?.[0] || 'Member')} {user.jobTitle ? \`• \${user.jobTitle}\` : ''}</p>
                </div>
              </div>
            ))}
            {deptUsers.length === 0 && (
              <div className="text-center py-10 bg-neutral-50 rounded-[24px] border border-neutral-100 border-dashed text-neutral-400 font-medium">
                هیچ ئەندامێک نەدۆزرایەوە
              </div>
            )}
          </div>
        </div>`;

const replace = `{/* Right Column: Members Gallery */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon icon="solar:users-group-two-rounded-bold-duotone" width={22} />
            </div>
            ئەندامەکانی دەستە
          </h3>
          
          <div className="bg-neutral-900 rounded-[32px] overflow-hidden relative shadow-lg" style={{ height: '500px' }}>
            {deptUsers.length > 0 ? (
              <>
                <CircularGallery
                  items={deptUsers.map(u => ({
                    id: u.id,
                    image: u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`,
                    text: u.name
                  }))}
                  bend={3}
                  textColor="#ffffff"
                  borderRadius={0.05}
                  scrollSpeed={3}
                  onItemClick={(item) => {
                    if (onNavigate && item.id) {
                      setViewProfileId(item.id);
                      onNavigate('profiles');
                    }
                  }}
                />
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <span className="bg-black/50 text-white/70 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">کاردەکات بە ڕاکێشان و پەنجەدان</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                  <Icon icon="solar:user-cross-bold-duotone" width={32} className="text-white/50" />
                </div>
                <p className="text-white/60 font-medium">هیچ ئەندامێک نەدۆزرایەوە</p>
              </div>
            )}
          </div>
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('Success Gallery');
} else {
  console.log('Failed to find target gallery');
}
