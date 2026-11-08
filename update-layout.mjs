import fs from 'fs';

let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

if (!code.includes('import { ProfileSettingsModal } from "./ProfileSettingsModal";')) {
    code = code.replace("import { NotificationsPopover } from './NotificationsPopover';", "import { NotificationsPopover } from './NotificationsPopover';\nimport { ProfileSettingsModal } from './ProfileSettingsModal';");
}
if (!code.includes('import { ProfileSettingsModal } from')) {
    code = code.replace("import { NotificationsPopover } from './NotificationsPopover';", "import { NotificationsPopover } from './NotificationsPopover';\nimport { ProfileSettingsModal } from './ProfileSettingsModal';");
}

if (!code.includes('const [showProfileModal, setShowProfileModal] = useState(false);')) {
    code = code.replace("const [showMobileMenu, setShowMobileMenu] = useState(false);", "const [showMobileMenu, setShowMobileMenu] = useState(false);\n  const [showProfileModal, setShowProfileModal] = useState(false);");
}

const targetDiv = `<div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
              {currentUser.name.charAt(0)}
            </div>`;
const newDiv = `<div 
            className="flex items-center gap-3 mb-4 px-2 p-2 -mx-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            onClick={() => setShowProfileModal(true)}
            title="ڕێکخستنەکانی هەژمار"
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shadow-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}`;
            
code = code.replace(targetDiv, newDiv);

const renderTarget = `{children}
        </main>
      </div>
    </div>`;

const newRenderTarget = `{children}
        </main>
      </div>

      {showProfileModal && currentUser && (
        <ProfileSettingsModal 
          user={currentUser} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>`;

code = code.replace(renderTarget, newRenderTarget);

fs.writeFileSync('src/components/Layout.tsx', code);
