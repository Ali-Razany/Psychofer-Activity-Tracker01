const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

// Need to import AnimatePresence, motion from 'motion/react'
if (!code.includes("import { motion, AnimatePresence } from 'motion/react';")) {
  code = code.replace(`import { Icon } from '@iconify/react';`, `import { Icon } from '@iconify/react';\nimport { motion, AnimatePresence } from 'motion/react';`);
}

// Add state for selected user
const targetState = `const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);`;
const replaceState = `const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState('');
  const { updateProfile } = useAppContext();

  const handleSaveBio = async () => {
    if (!selectedUser) return;
    try {
      await updateProfile(selectedUser.id, { bio: editBioText });
      setSelectedUser({ ...selectedUser, bio: editBioText });
      setIsEditingBio(false);
    } catch (error) {
      console.error(error);
      alert('هەڵەیەک ڕوویدا لە کاتی پاشەکەوتکردن');
    }
  };`;

if (code.includes(targetState)) {
  code = code.replace(targetState, replaceState);
} else {
  console.log('Failed to add state');
}

// Change gallery container height and font
const targetGallery = `<div className="bg-white rounded-[32px] overflow-hidden relative shadow-sm border border-neutral-100" style={{ height: '500px' }}>`;
const replaceGallery = `<div className="bg-white rounded-[32px] overflow-hidden relative shadow-sm border border-neutral-100" style={{ height: '400px' }}>`;
code = code.replace(targetGallery, replaceGallery);

const targetCircularProps = `bend={3}
                  fontUrl=""
                  textColor="#171717"
                  borderRadius={0.05}
                  scrollSpeed={3}
                  onItemClick={(item) => {
                    if (onNavigate && item.id) {
                      setViewProfileId(item.id);
                      onNavigate('profiles');
                    }
                  }}`;
const replaceCircularProps = `bend={3}
                  font="bold 20px NRT, NAKA, sans-serif"
                  fontUrl=""
                  textColor="#171717"
                  borderRadius={0.05}
                  scrollSpeed={3}
                  onItemClick={(item) => {
                    const u = users.find(u => u.id === item.id);
                    if (u) {
                      setSelectedUser(u);
                      setEditBioText(u.bio || '');
                      setIsEditingBio(false);
                    }
                  }}`;
code = code.replace(targetCircularProps, replaceCircularProps);

// Add modal at the end of the return statement
const targetEnd = `</div>
    </div>
  );
}`;
const replaceEnd = `</div>
      
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-neutral-100"
            >
              <div className="p-6 relative">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors z-10"
                >
                  <Icon icon="solar:close-circle-bold" width={20} />
                </button>

                <div className="flex flex-col items-center mt-4">
                  <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-sm overflow-hidden mb-4">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-indigo-600">
                        {selectedUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-neutral-900">{selectedUser.name}</h3>
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    {selectedUser.roles?.map((role: string) => (
                      <span key={role} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        {role === 'Admin' ? 'سەرپەرشتیاری گشتی' : role === 'Supervisor' ? 'سەرپەرشتیاری دەستە' : 'ئەندام'}
                      </span>
                    ))}
                    {selectedUser.jobTitle && (
                      <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-full">
                        {selectedUser.jobTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-neutral-500 uppercase tracking-wider">زانیاری زیاتر</h4>
                    {(currentUser?.id === selectedUser.id || 
                      currentUser?.roles?.some(r => ['Admin', 'AssistantAdmin'].includes(r)) || 
                      (currentUser?.roles?.includes('Supervisor') && currentUser?.departments?.some(d => selectedUser.departments?.includes(d)))) && (
                      <button 
                        onClick={() => setIsEditingBio(!isEditingBio)}
                        className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                      >
                        <Icon icon="solar:pen-new-square-linear" width={16} />
                        دەستکاری
                      </button>
                    )}
                  </div>
                  
                  {isEditingBio ? (
                    <div className="space-y-3">
                      <textarea
                        value={editBioText}
                        onChange={(e) => setEditBioText(e.target.value)}
                        placeholder="زانیاری لەسەر ئەندام بنووسە..."
                        className="w-full h-32 p-4 bg-neutral-50 border border-neutral-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setIsEditingBio(false)}
                          className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                        >
                          پاشگەزبوونەوە
                        </button>
                        <button 
                          onClick={handleSaveBio}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors shadow-sm"
                        >
                          پاشەکەوتکردن
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                      {selectedUser.bio ? (
                        <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedUser.bio}</p>
                      ) : (
                        <p className="text-neutral-400 text-sm italic text-center py-4">هیچ زانیارییەک نەنووسراوە</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-neutral-100 flex justify-center">
                  <button 
                    onClick={() => {
                      if (onNavigate) {
                        setViewProfileId(selectedUser.id);
                        onNavigate('profiles');
                      }
                    }}
                    className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                  >
                    بینینی پڕۆفایلی تەواو
                    <Icon icon="solar:arrow-left-linear" width={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}`;

code = code.replace(targetEnd, replaceEnd);
fs.writeFileSync('src/components/DepartmentsList.tsx', code);
console.log('done');
