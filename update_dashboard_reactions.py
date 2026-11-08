import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Update state/effects to include handleReaction
new_state = """  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🎉', '🔥'];

  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setRecentComments(data);
    });
    return () => unsubscribe();
  }, []);

  const handleReaction = async (e: React.MouseEvent, commentId: string, emoji: string, currentReactions: Record<string, string[]> = {}, likes: string[] = []) => {
    e.stopPropagation();
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    
    const newReactions = { ...currentReactions };
    
    if (likes.length > 0) {
      if (!newReactions['❤️']) newReactions['❤️'] = [];
      likes.forEach(userId => {
        if (!newReactions['❤️'].includes(userId)) {
          newReactions['❤️'].push(userId);
        }
      });
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

content = re.sub(
    r"  const \[recentComments, setRecentComments\] = useState<Comment\[\]>\(\);.*?  };",
    new_state,
    content,
    flags=re.DOTALL
)

# Replace reactions UI in the card
old_actions = """                  <div className="flex items-center gap-3 pt-3 border-t border-surface-border mt-auto">
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
                  </div>"""

new_actions = """                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-surface-border mt-auto relative">
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReactionsFor(showReactionsFor === comment.id ? null : comment.id);
                        }}
                        className="flex items-center gap-1 text-[10px] sm:text-xs font-bold transition-colors text-neutral-500 hover:text-neutral-800 bg-surface-bg px-2 py-1 rounded-full border border-surface-border"
                      >
                        <Icon icon="fluent:emoji-add-24-regular" width={14} />
                        ڕیاکت
                      </button>
                      
                      {showReactionsFor === comment.id && (
                        <div className="absolute bottom-full mb-1 right-0 bg-surface-paper border border-surface-border shadow-custom rounded-full px-2 py-1 flex items-center gap-1.5 z-20 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                          {AVAILABLE_REACTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={(e) => handleReaction(e, comment.id, emoji, comment.reactions, likes)}
                              className="text-lg hover:scale-125 transition-transform origin-bottom"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {Object.entries({ ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }).slice(0, 3).map(([emoji, userIds]) => {
                      if (!userIds || (userIds as string[]).length === 0) return null;
                      const hasReacted = (userIds as string[]).includes(currentUser?.id || '');
                      return (
                        <button
                          key={emoji}
                          onClick={(e) => handleReaction(e, comment.id, emoji, comment.reactions, likes)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
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
                    
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-neutral-500 mr-auto">
                      <Icon icon="fluent:comment-24-regular" width={14} />
                      {replyCount}
                    </div>
                  </div>"""

content = content.replace(old_actions, new_actions)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
