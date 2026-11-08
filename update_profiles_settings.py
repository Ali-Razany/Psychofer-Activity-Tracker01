import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

old_header = """            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center gap-6">"""

new_header = """            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* Settings Button (only for current user) */}
                {selectedUser.id === currentUser?.id && (
                  <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-profile-settings'))}
                    className="absolute top-0 left-0 md:static md:ml-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-md"
                  >
                    <Icon icon="hugeicons:settings-01" width={22} />
                  </button>
                )}"""

content = content.replace(old_header, new_header)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
