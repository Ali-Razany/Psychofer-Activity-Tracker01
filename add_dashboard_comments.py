import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

recent_comments_ui = """      {/* Recent Psychosphere Comments */}
      <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
            <Icon icon="fluent-emoji:speech-balloon" width={24} />
            نوێترینەکانی دیوەخانی سایکۆفێر
          </h3>
          <button 
            onClick={() => onNavigate?.('public-comments')}
            className="text-sm text-primary font-bold hover:text-primary-dark transition-colors flex items-center gap-1"
          >
            هەمووی ببینە
            <Icon icon="oui:arrow-left" width={16} />
          </button>
        </div>
        
        {recentComments.length === 0 ? (
          <div className="text-center py-6 text-neutral-500 bg-surface-bg rounded-[20px] border border-dashed border-surface-border">
            هیچ نامەیەک نییە لە دیوەخان.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentComments.map(comment => {
              const author = users.find(u => u.id === comment.userId);
              const likes = comment.likes || [];
              const isLiked = likes.includes(currentUser.id);
              const replyCount = comment.replies?.length || 0;
              
              return (
                <div 
                  key={comment.id}
                  onClick={() => onNavigate?.('public-comments')}
                  className="bg-surface-bg p-5 rounded-[20px] border border-surface-border flex flex-col hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {author?.avatar ? (
                      <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-surface-border shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold shadow-sm shrink-0">
                        {author?.name.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-neutral-800 truncate">{author?.name || 'نەناسراو'}</h4>
                      <p className="text-[10px] text-neutral-500 truncate" dir="ltr">
                        {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: ku })}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-neutral-700 mb-4 line-clamp-3 flex-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-surface-border mt-auto">
                    <button 
                      onClick={(e) => handleLike(e, comment.id, likes)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-neutral-800'}`}
                    >
                      <Icon icon={isLiked ? "fluent:heart-24-filled" : "fluent:heart-24-regular"} width={16} />
                      {likes.length}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
                      <Icon icon="fluent:comment-24-regular" width={16} />
                      {replyCount}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">"""

content = content.replace('      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">', recent_comments_ui)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
