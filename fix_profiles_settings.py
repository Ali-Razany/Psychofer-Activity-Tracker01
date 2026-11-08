import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Remove the button from inside the flex row
content = re.sub(
    r"""                \{/\* Settings Button \(only for current user\) \*/\}
                \{selectedUser\.id === currentUser\?\.id && \(
                  <button 
                    onClick=\{\(\) => window\.dispatchEvent\(new CustomEvent\('open-profile-settings'\)\)\}
                    className="absolute top-0 left-0 md:static md:ml-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-md"
                  >
                    <Icon icon="hugeicons:settings-01" width=\{22\} />
                  </button>
                \)\}""", 
    "", 
    content
)

# Add it as absolute top-left on the header
old_header_start = """          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[32px] p-8 md:p-10 mb-8 relative overflow-hidden shadow-lg">"""

new_header_start = """          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[32px] p-8 md:p-10 mb-8 relative overflow-hidden shadow-lg">
            {/* Settings Button */}
            {selectedUser.id === currentUser?.id && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-profile-settings'))}
                className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-md shadow-sm"
              >
                <Icon icon="hugeicons:settings-01" width={22} />
              </button>
            )}"""

content = content.replace(old_header_start, new_header_start)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
