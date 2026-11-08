import re

with open('src/components/PublicComments.tsx', 'r') as f:
    content = f.read()

# 1. Add state
state_injection = """  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🎉', '🔥'];

  const handleReaction = async (commentId: string, emoji: string, currentReactions: Record<string, string[]> = {}, likes: string[] = []) => {
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    
    const newReactions = { ...currentReactions };
    
    // Auto-migrate old likes to heart reaction if they haven't been migrated
    if (likes.length > 0) {
      if (!newReactions['❤️']) newReactions['❤️'] = [];
      likes.forEach(userId => {
        if (!newReactions['❤️'].includes(userId)) {
          newReactions['❤️'].push(userId);
        }
      });
      // Clear likes after migration
      await updateDoc(commentRef, { likes: [], reactions: newReactions });
    }
    
    const userReacted = (newReactions[emoji] || []).includes(currentUser.id);
    
    if (userReacted) {
      newReactions[emoji] = newReactions[emoji].filter(id => id !== currentUser.id);
      if (newReactions[emoji].length === 0) {
        delete newReactions[emoji];
      }
    } else {
      if (!newReactions[emoji]) {
        newReactions[emoji] = [];
      }
      newReactions[emoji].push(currentUser.id);
    }
    
    await updateDoc(commentRef, { reactions: newReactions });
    setShowReactionsFor(null);
  };"""

content = content.replace("""  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = async (commentId: string, likes: string[] = []) => {
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    if (likes.includes(currentUser.id)) {
      await updateDoc(commentRef, { likes: arrayRemove(currentUser.id) });
    } else {
      await updateDoc(commentRef, { likes: arrayUnion(currentUser.id) });
    }
  };""", state_injection)

# 2. Update the reactions UI
old_actions = """                  <div className="flex items-center gap-4 pt-4 border-t border-surface-border">
                    <button 
                      onClick={() => handleLike(comment.id, likes)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-neutral-800'}`}
                    >
                      <Icon icon={isLiked ? "fluent:heart-24-filled" : "fluent:heart-24-regular"} width={18} />
                      {likes.length} دڵ
                    </button>
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${replyingTo === comment.id ? 'text-primary' : 'text-neutral-500 hover:text-neutral-800'}`}
                    >
                      <Icon icon="fluent:comment-24-regular" width={18} />
                      {replies.length} کۆمێنت
                    </button>
                  </div>"""

new_actions = """                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-surface-border relative">
                    <div className="relative">
                      <button 
                        onClick={() => setShowReactionsFor(showReactionsFor === comment.id ? null : comment.id)}
                        className="flex items-center gap-1.5 text-xs font-bold transition-colors text-neutral-500 hover:text-neutral-800 bg-surface-bg px-3 py-1.5 rounded-full border border-surface-border"
                      >
                        <Icon icon="fluent:emoji-add-24-regular" width={16} />
                        ڕیاکت
                      </button>
                      
                      {showReactionsFor === comment.id && (
                        <div className="absolute bottom-full mb-2 right-0 bg-surface-paper border border-surface-border shadow-custom rounded-full px-3 py-2 flex items-center gap-2 z-20 animate-fade-in-up">
                          {AVAILABLE_REACTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(comment.id, emoji, comment.reactions, likes)}
                              className="text-xl hover:scale-125 transition-transform origin-bottom"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Render active reactions */}
                    {Object.entries({ ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }).map(([emoji, userIds]) => {
                      if (!userIds || (userIds as string[]).length === 0) return null;
                      const hasReacted = (userIds as string[]).includes(currentUser?.id || '');
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji, comment.reactions, likes)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border transition-colors ${
                            hasReacted 
                              ? 'bg-primary-light/30 border-primary/30 text-primary-dark' 
                              : 'bg-surface-bg border-surface-border text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{(userIds as string[]).length}</span>
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors mr-auto px-3 py-1.5 rounded-full ${replyingTo === comment.id ? 'bg-primary-light/20 text-primary' : 'text-neutral-500 hover:bg-surface-bg'}`}
                    >
                      <Icon icon="fluent:comment-24-regular" width={16} />
                      {replies.length} کۆمێنت
                    </button>
                  </div>"""

content = content.replace(old_actions, new_actions)

with open('src/components/PublicComments.tsx', 'w') as f:
    f.write(content)
