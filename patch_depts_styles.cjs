const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

const target = `<div className="bg-neutral-900 rounded-[32px] overflow-hidden relative shadow-lg" style={{ height: '500px' }}>
            {deptUsers.length > 0 ? (
              <>
                <CircularGallery
                  items={deptUsers.map(u => ({
                    id: u.id,
                    image: u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`,
                    text: u.name
                  }))}
                  bend={3}
                  fontUrl=""
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
          </div>`;

const replace = `<div className="bg-white rounded-[32px] overflow-hidden relative shadow-sm border border-neutral-100" style={{ height: '500px' }}>
            {deptUsers.length > 0 ? (
              <>
                <CircularGallery
                  items={deptUsers.map(u => ({
                    id: u.id,
                    image: u.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(u.name)}&background=random&size=400\`,
                    text: u.name
                  }))}
                  bend={3}
                  fontUrl=""
                  textColor="#171717"
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

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/DepartmentsList.tsx', code);
  console.log('patched styles');
} else {
  console.log('failed to find target');
}
