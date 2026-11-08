import fs from 'fs';

let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const endOfFile = `        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}`;

const replacement = `        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {showProfileModal && currentUser && (
        <ProfileSettingsModal 
          user={currentUser} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}`;

code = code.replace(endOfFile, replacement);

fs.writeFileSync('src/components/Layout.tsx', code);
