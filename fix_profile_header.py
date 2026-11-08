import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'          \{/\* Friendly Profile Header \*/\}.*?          </div>\n\n          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', re.DOTALL)

new_header = """          {/* Friendly Profile Header */}
          <div className="bg-surface-paper rounded-3xl overflow-hidden shadow-sm border border-surface-border w-full max-w-4xl mx-auto mb-8 relative">
            <div className="h-40 relative" style={{background: 'linear-gradient(180deg, #a8c8dc 0%, #d4e5ed 100%)'}}>
              {selectedUser.id === currentUser?.id && (
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-profile-settings'))}
                  className="absolute top-4 left-4 bg-white px-5 py-2 rounded-full text-sm font-bold text-neutral-800 flex items-center gap-1.5 shadow hover:bg-neutral-50 transition-all z-20"
                >
                  <Icon icon="hugeicons:settings-01" width={18} />
                  دەستکاری پڕۆفایل
                </button>
              )}
            </div>
            
            <div className="flex justify-center -mt-16 relative z-10">
              {selectedUser.avatar ? (
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow-md bg-white shrink-0" />
              ) : (
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-primary-light to-primary-light/50 flex items-center justify-center font-bold text-5xl text-primary-dark shrink-0">
                  {selectedUser.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="text-center px-6 pb-8 md:pb-10 mt-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-800 tracking-tight">{selectedUser.name}</h2>
              <p className="text-sm font-medium text-neutral-500 mt-1.5 flex items-center justify-center gap-1.5">
                <span className="bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">{getRoleName((selectedUser.roles?.[0] || "Member"))}</span>
                <span>•</span>
                <span className="bg-primary-light/20 text-primary-dark px-2.5 py-0.5 rounded-full">{departments.find(d => d.id === (selectedUser.departments?.[0] || ""))?.name || (selectedUser.departments?.[0] || "")}</span>
                {selectedUser.jobTitle && (
                  <>
                    <span>•</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">{selectedUser.jobTitle}</span>
                  </>
                )}
              </p>

              <div className="mt-8 bg-neutral-50/80 rounded-2xl py-5 flex max-w-2xl mx-auto shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-neutral-100">
                  <div className="flex-1 text-center border-l border-neutral-200/60">
                      <span className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1.5">
                        {selectedUser.points} <Icon icon="fluent-emoji:star" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">کۆی خاڵەکان</div>
                  </div>
                  <div className="flex-1 text-center border-l border-neutral-200/60">
                      <span className="text-2xl font-black text-emerald-500 flex items-center justify-center gap-1.5">
                        {userLogs.length} <Icon icon="fluent-emoji:chart-increasing" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">چالاکییەکان</div>
                  </div>
                  <div className="flex-1 text-center">
                      <span className="text-2xl font-black text-primary flex items-center justify-center gap-1.5">
                        {selectedUser.badges?.length || 0} <Icon icon="fluent-emoji:trophy" width={22} className="opacity-90" />
                      </span>
                      <div className="text-xs text-neutral-500 mt-1 font-bold tracking-wide">دەستکەوتەکان</div>
                  </div>
              </div>

              {selectedUser.bio && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <p className="text-neutral-600 leading-relaxed text-sm md:text-base font-medium">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {/* Socials */}
              <div className="flex justify-center gap-5 mt-8">
                  {selectedUser.socials?.telegram && (
                    <a href={selectedUser.socials.telegram.startsWith('http') ? selectedUser.socials.telegram : `https://t.me/${selectedUser.socials.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-blue-50/80 border border-blue-100 hover:bg-blue-100 flex items-center justify-center text-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="logos:telegram" width={20} />
                    </a>
                  )}
                  {selectedUser.socials?.facebook && (
                    <a href={selectedUser.socials.facebook} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-blue-50/80 border border-blue-100 hover:bg-blue-100 flex items-center justify-center text-blue-700 hover:text-blue-800 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="logos:facebook" width={22} />
                    </a>
                  )}
                  {selectedUser.socials?.instagram && (
                    <a href={selectedUser.socials.instagram.startsWith('http') ? selectedUser.socials.instagram : `https://instagram.com/${selectedUser.socials.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-pink-50/80 border border-pink-100 hover:bg-pink-100 flex items-center justify-center text-pink-600 hover:text-pink-700 transition-all shadow-sm hover:shadow hover:-translate-y-0.5">
                      <Icon icon="skill-icons:instagram" width={20} />
                    </a>
                  )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">"""

if pattern.search(content):
    content = pattern.sub(new_header, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found")
