import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Replace Profile Header to add modern friendly look + socials
header_replacement = """
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-[32px] p-8 md:p-10 mb-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-right">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl bg-white" />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white text-primary flex items-center justify-center font-bold text-4xl border-4 border-white shadow-xl">
                      {selectedUser.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1">
                    <Icon icon="fluent-emoji:star" width={14} />
                    {selectedUser.points}
                  </div>
                </div>
                
                <div className="mt-2 md:mt-0">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedUser.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm text-white font-medium">
                      {getRoleName(selectedUser.roles[0])}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm text-white font-medium">
                      {departments.find(d => d.id === selectedUser.departments[0])?.name || selectedUser.departments[0]}
                    </span>
                    {selectedUser.jobTitle && (
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm text-white border border-white/20">
                        {selectedUser.jobTitle}
                      </span>
                    )}
                  </div>
                  
                  {/* Socials */}
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                    {selectedUser.socials?.telegram && (
                      <a href={selectedUser.socials.telegram.startsWith('http') ? selectedUser.socials.telegram : `https://t.me/${selectedUser.socials.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10">
                        <Icon icon="logos:telegram" width={20} />
                      </a>
                    )}
                    {selectedUser.socials?.facebook && (
                      <a href={selectedUser.socials.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10">
                        <Icon icon="logos:facebook" width={20} />
                      </a>
                    )}
                    {selectedUser.socials?.instagram && (
                      <a href={selectedUser.socials.instagram.startsWith('http') ? selectedUser.socials.instagram : `https://instagram.com/${selectedUser.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors backdrop-blur-md border border-white/10">
                        <Icon icon="skill-icons:instagram" width={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-[20px] font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-md w-full"
                >
                  <Icon icon="oui:arrow-right" width={18} />
                  گەڕانەوە
                </button>
                {canAwardBadge && (
                  <button 
                    onClick={() => setShowBadgeModal(true)}
                    className="bg-white text-primary hover:bg-blue-50 px-5 py-2.5 rounded-[20px] font-bold transition-all shadow-md flex items-center justify-center gap-2 w-full"
                  >
                    <Icon icon="fluent-emoji:sports-medal" width={18} />
                    پێدانی نیشانە
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {selectedUser.bio && (
            <div className="bg-surface-paper rounded-[24px] shadow-custom border border-surface-border p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-neutral-100">
                <Icon icon="hugeicons:quote-up" width={80} />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-3 relative z-10">دەربارەی من</h3>
              <p className="text-neutral-600 leading-relaxed relative z-10 whitespace-pre-wrap">
                {selectedUser.bio}
              </p>
            </div>
          )}
"""

content = re.sub(
    r'\{\/\* Profile Header \*\/\}.*?(?=\<div className="grid grid-cols-1 lg:grid-cols-3 gap-6"\>)',
    header_replacement,
    content,
    flags=re.DOTALL
)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
