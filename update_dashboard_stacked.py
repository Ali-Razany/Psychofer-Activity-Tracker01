import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace Welcome Banner with Stacked Comments
old_banner = """      {/* Welcome Banner */}
      <div className="bg-primary text-white rounded-[24px] p-8 shadow-custom relative overflow-hidden flex items-center">
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl font-bold mb-2">بەخێربێیتەوە، {currentUser.name}!</h1>
          <p className="text-primary-light text-lg">ئەمڕۆ چی دەکەیت؟ با دەست پێبکەین.</p>
        </div>
        <div className="hidden md:block relative z-10">
          <Icon icon="fluent-emoji:rocket" width={100} />
        </div>
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
      </div>"""

new_banner = """      {/* Stacked Psychosphere Comments */}
      {recentComments.length > 0 && (
        <div className="relative w-full h-[250px] mb-8">
          <AnimatePresence>
            {recentComments.filter(c => !dismissedComments.includes(c.id)).slice(0, 3).map((comment, index) => {
              const author = users.find(u => u.id === comment.userId);
              const likes = comment.likes || [];
              const replyCount = comment.replies?.length || 0;
              const isTop = index === 0;
              
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: 1 - (index * 0.2), 
                    y: index * 15, 
                    scale: 1 - (index * 0.05),
                    zIndex: 10 - index
                  }}
                  exit={{ opacity: 0, x: -200, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 w-full"
                >
                  <div 
                    onClick={() => {
                      if (isTop && onNavigate) onNavigate('public-comments');
                    }}
                    className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] p-6 md:p-8 shadow-custom relative overflow-hidden flex flex-col h-[220px] ${isTop ? 'cursor-pointer hover:shadow-lg transition-shadow' : 'pointer-events-none'}`}
                  >
                    {isTop && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDismissedComments(prev => [...prev, comment.id]);
                        }}
                        className="absolute top-4 left-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-20"
                      >
                        <Icon icon="hugeicons:cancel-01" width={18} />
                      </button>
                    )}
                    
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex items-center gap-3 mb-4">
                      {author?.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 backdrop-blur-sm">
                          {author?.name.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate">{author?.name || 'نەناسراو'}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-blue-100 opacity-90">
                          <Icon icon="fluent-emoji:speech-balloon" width={14} />
                          <span>دیوەخانی سایکۆفێر</span>
                          <span>•</span>
                          <span dir="ltr">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white/90 text-sm md:text-base leading-relaxed line-clamp-3 mb-auto relative z-10 whitespace-pre-wrap flex-1">
                      {comment.content}
                    </p>
                    
                    {isTop && (
                      <div className="flex items-center gap-3 pt-3 mt-2 border-t border-white/10 relative z-10">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                          <Icon icon="fluent:heart-24-filled" width={16} />
                          {(likes.length || 0) + Object.values(comment.reactions || {}).flat().length} ڕیاکت
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                          <Icon icon="fluent:comment-24-regular" width={16} />
                          {replyCount} کۆمێنت
                        </div>
                        <div className="mr-auto text-xs font-bold text-white/90 flex items-center gap-1">
                          کرتە بکە بۆ بینین
                          <Icon icon="oui:arrow-left" width={12} />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {recentComments.filter(c => !dismissedComments.includes(c.id)).length === 0 && (
             <div className="bg-surface-paper border border-dashed border-surface-border rounded-[24px] h-[220px] flex flex-col items-center justify-center text-neutral-500">
               <Icon icon="fluent-emoji:ghost" width={48} className="mb-3 opacity-50" />
               <p>هیچ نامەیەکی نوێ نییە لە دیوەخان</p>
               <button 
                 onClick={() => setDismissedComments([])}
                 className="mt-4 text-sm text-primary font-bold hover:underline"
               >
                 گەڕاندنەوەی نامەکان
               </button>
             </div>
          )}
        </div>
      )}"""

content = content.replace(old_banner, new_banner)

# Remove the old Recent Comments section
old_recent_comments = re.search(r'      {/\* Recent Psychosphere Comments \*/}.*?      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', content, re.DOTALL)
if old_recent_comments:
    content = content.replace(old_recent_comments.group(0), '      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">')

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
