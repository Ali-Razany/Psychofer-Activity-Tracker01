import re

with open('src/components/PrivateRoom.tsx', 'r') as f:
    content = f.read()

# Add state for blog (rules)
content = content.replace(
    "const [loading, setLoading] = useState(false);",
    """const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'rules'>('chat');
  const [blogContent, setBlogContent] = useState('');
  const [isEditingBlog, setIsEditingBlog] = useState(false);"""
)

# Helper for members
content = content.replace(
    "// Determine which department room to show based on role",
    """// Determine which department room to show based on role
  const roomMembers = users.filter(u => u.departments.includes(selectedDeptId)).sort((a, b) => b.points - a.points);
  const isSupervisor = currentUser?.roles.includes('Supervisor') && currentUser.departments.includes(selectedDeptId);
  const isAdmin = currentUser?.roles.includes('Admin') || currentUser?.roles.includes('AssistantAdmin');
  const canEditBlog = isSupervisor || isAdmin;
"""
)

# Replace the JSX return
jsx_replacement = """
  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Sidebar for Navigation in Mobile & Desktop */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        {canSelectDept && (
          <div className="bg-surface-paper p-4 rounded-[24px] shadow-custom border border-surface-border">
            <label className="text-sm font-bold text-neutral-800 mb-2 block">گۆڕینی ژوور</label>
            <select 
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full bg-surface-bg border border-surface-border rounded-[16px] px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
            >
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        )}
        
        <div className="bg-surface-paper rounded-[24px] shadow-custom border border-surface-border overflow-hidden">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full text-right px-4 py-3 border-b border-surface-border flex items-center gap-3 transition-colors ${activeTab === 'chat' ? 'bg-primary/5 text-primary border-r-4 border-r-primary' : 'text-neutral-600 hover:bg-surface-bg'}`}
          >
            <Icon icon="hugeicons:chatting-01" width={20} />
            <span className="font-bold">چاتی ژوور</span>
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`w-full text-right px-4 py-3 border-b border-surface-border flex items-center gap-3 transition-colors ${activeTab === 'members' ? 'bg-primary/5 text-primary border-r-4 border-r-primary' : 'text-neutral-600 hover:bg-surface-bg'}`}
          >
            <Icon icon="hugeicons:user-group" width={20} />
            <span className="font-bold">ئەندامانی دەستە</span>
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === 'rules' ? 'bg-primary/5 text-primary border-r-4 border-r-primary' : 'text-neutral-600 hover:bg-surface-bg'}`}
          >
            <Icon icon="hugeicons:note-01" width={20} />
            <span className="font-bold">کارنامە و ڕێنمایی</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-surface-paper rounded-[24px] shadow-custom border border-surface-border flex flex-col overflow-hidden h-[70vh] md:h-auto">
        {activeTab === 'chat' && (
          <>
            <div className="bg-surface-paper p-4 border-b border-surface-border flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                  <Icon icon="fluent-emoji:speech-balloon" width={24} />
                  چاتی {deptName}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">ئەم ژوورە تایبەتە بە ئەندامانی ئەم دەستەیە</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                  <Icon icon="hugeicons:chat-bot" width={48} className="mb-2 opacity-50" />
                  <p>هیچ نامەیەک نییە. یەکەم کەس بە نامەیەک بنێرە!</p>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.userId === currentUser.id;
                  const sender = users.find(u => u.id === msg.userId);
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-surface-bg text-neutral-800 rounded-bl-none border border-surface-border'} rounded-[20px] p-3 md:p-4 shadow-sm`}>
                        {!isMe && <div className="text-xs font-bold mb-1 opacity-75">{sender?.name || 'نەناسراو'}</div>}
                        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        <div className={`text-[10px] mt-2 text-left ${isMe ? 'text-blue-100' : 'text-neutral-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString('ku-IQ', {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-surface-border bg-surface-bg/50 shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="نامەکەت بنووسە..."
                  className="flex-1 bg-white border border-surface-border rounded-[20px] px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || loading}
                  className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0 shadow-sm"
                >
                  <Icon icon="fluent:send-24-filled" width={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
                </button>
              </div>
            </form>
          </>
        )}

        {activeTab === 'members' && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-surface-border shrink-0">
              <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <Icon icon="fluent-emoji:people-hugging" width={24} />
                ئەندامانی {deptName}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              {roomMembers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-surface-bg rounded-[20px] border border-surface-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border border-surface-border" />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-neutral-800 text-sm">{user.name}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {user.roles.includes('Admin') ? 'سەرپەرشتیاری گشتی' : 
                         user.roles.includes('Supervisor') ? 'سەرپەرشتیاری دەستە' : 
                         user.roles.includes('AssistantAdmin') ? 'یاریدەدەری دەستە' : 'ئەندام'}
                        {user.jobTitle && ` • ${user.jobTitle}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">{user.points} خاڵ</span>
                    <span className="text-[10px] text-neutral-400 mt-1">ڕیزبەندی #{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-surface-border shrink-0 flex justify-between items-center">
              <h2 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                <Icon icon="fluent-emoji:scroll" width={24} />
                کارنامە و ڕێنماییەکانی دەستە
              </h2>
              {canEditBlog && !isEditingBlog && (
                <button 
                  onClick={() => setIsEditingBlog(true)}
                  className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 transition-colors"
                >
                  دەستکاری
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {isEditingBlog ? (
                <div className="flex flex-col h-full gap-4">
                  <textarea 
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="یاسا و ڕێنماییەکان لێرە بنووسە..."
                    className="flex-1 w-full p-4 bg-surface-bg border border-surface-border rounded-[20px] focus:outline-none focus:border-primary resize-none custom-scrollbar"
                  />
                  <div className="flex justify-end gap-2 shrink-0">
                    <button 
                      onClick={() => setIsEditingBlog(false)}
                      className="px-4 py-2 text-neutral-600 hover:bg-surface-bg rounded-[16px] font-medium"
                    >
                      پاشگەزبوونەوە
                    </button>
                    <button 
                      onClick={() => setIsEditingBlog(false)}
                      className="px-4 py-2 bg-primary text-white rounded-[16px] font-medium hover:bg-primary-dark"
                    >
                      پاشەکەوتکردن
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm md:prose-base max-w-none prose-neutral rtl">
                  {blogContent ? (
                    <div className="whitespace-pre-wrap">{blogContent}</div>
                  ) : (
                    <div className="text-center py-10 text-neutral-400">
                      <Icon icon="hugeicons:note-add" width={48} className="mx-auto mb-3 opacity-50" />
                      <p>هیچ کارنامە و ڕێنماییەک نییە بۆ ئەم دەستەیە.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
"""

content = re.sub(r'return\s*\(\s*<div className="h-full flex flex-col md:flex-row gap-6">.*', jsx_replacement, content, flags=re.DOTALL)

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.write(content)
