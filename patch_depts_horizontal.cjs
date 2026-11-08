const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const target = `<div className="bg-white rounded-[32px] overflow-hidden relative shadow-sm border border-neutral-100" style={{ height: '400px' }}>
            {deptUsers.length > 0 ? (
              <>
                <CircularGallery
                  items={deptUsers.map(u => ({
                    id: u.id,
                    image: u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`,
                    text: u.name
                  }))}
                  bend={0}
                  font="bold 20px Vazirmatn, sans-serif"
                  fontUrl="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap"
                  textColor="#171717"
                  borderRadius={0.5}
                  scrollSpeed={3}
                  scrollEase={0.05}
                  onItemClick={(item) => {
                    const u = users.find(u => u.id === item.id);
                    if (u) {
                      setSelectedUser(u);
                      setEditBioText(u.bio || '');
                      setIsEditingBio(false);
                    }
                  }}
                />
                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <span className="bg-white/80 text-neutral-600 text-xs px-3 py-1.5 rounded-full shadow-sm backdrop-blur border border-neutral-200">کاردەکات بە ڕاکێشان و پەنجەدان</span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-neutral-100">
                  <Icon icon="solar:user-cross-bold-duotone" width={32} className="text-neutral-400" />
                </div>
                <p className="text-neutral-500 font-medium">هیچ ئەندامێک نەدۆزرایەوە</p>
              </div>
            )}
          </div>`;

const replace = `<div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100">
            {deptUsers.length > 0 ? (
              <div className="flex overflow-x-auto pb-4 gap-6 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-neutral-50 flex items-center justify-center mb-4 border border-neutral-100">
                  <Icon icon="solar:user-cross-bold-duotone" width={32} className="text-neutral-400" />
                </div>
                <p className="text-neutral-500 font-medium">هیچ ئەندامێک نەدۆزرایەوە</p>
              </div>
            )}
          </div>`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched to horizontal list');
} else {
  console.log('failed to find target');
}
