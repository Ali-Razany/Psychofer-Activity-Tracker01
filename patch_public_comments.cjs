const fs = require('fs');
let content = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

// We need to add state for the modal
if (!content.includes('const [reactionsDetails, setReactionsDetails]')) {
  content = content.replace(
    "const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);",
    "const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);\n  const [reactionsDetails, setReactionsDetails] = useState<{commentId: string, reactions: Record<string, string[]>} | null>(null);"
  );
}

// We need to find where reactions are rendered, and add the "View" button.
// `                    {Object.entries({ ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }).map(([emoji, userIds]) => {`
// The container of these reactions is a div. Let's see:
/*
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
*/
// We can inject a "View Reactions" button right after the map.
// Let's replace the `                    })}
//                    
//                  </div>`
const searchMap = `                    })}
                    `;

const mapReplacement = `                    })}
                    
                    {Object.keys({ ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }).length > 0 && (
                      <button 
                        onClick={() => setReactionsDetails({commentId: comment.id, reactions: { ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }})}
                        className="text-[11px] text-neutral-400 hover:text-primary underline px-1"
                      >
                        (بینین)
                      </button>
                    )}
                    `;
content = content.replace(searchMap, mapReplacement);

// Add the modal component at the end of the return statement before the final `</div>`.
// Wait, we need the motion import for AnimatePresence.
if (!content.includes('import { AnimatePresence, motion }')) {
  content = content.replace("import { Icon } from '@iconify/react';", "import { Icon } from '@iconify/react';\nimport { AnimatePresence, motion } from 'framer-motion';");
}

const modalCode = `
      {/* Reactions Details Modal */}
      <AnimatePresence>
        {reactionsDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setReactionsDetails(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-paper rounded-[32px] shadow-2xl max-w-sm w-full p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-neutral-900 mb-4 border-b border-surface-border pb-3">کێ ڕیاکتی کردووە؟</h3>
              
              <div className="max-h-[60vh] overflow-y-auto space-y-3" dir="rtl">
                {Object.entries(reactionsDetails.reactions).map(([emoji, userIds]) => {
                  if (!userIds || userIds.length === 0) return null;
                  return (
                    <div key={emoji} className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full mb-2">
                        <span className="text-xl">{emoji}</span>
                        <span className="font-bold text-sm text-neutral-700">{userIds.length}</span>
                      </div>
                      <div className="space-y-2 pr-2">
                        {userIds.map(uid => {
                          const user = users.find(u => u.id === uid);
                          if (!user) return null;
                          return (
                            <div key={uid} className="flex items-center gap-3 p-2 bg-surface-bg rounded-2xl border border-surface-border cursor-pointer hover:border-primary/30 transition-colors" onClick={() => { setViewProfileId(user.id); }}>
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600 text-xs shrink-0">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-neutral-800 truncate">{user.name}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <button
                onClick={() => setReactionsDetails(null)}
                className="mt-6 w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold py-3 rounded-2xl transition-colors"
              >
                داخستن
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

// replace `    </div>\n  );\n}\n` with `modalCode`
content = content.replace("    </div>\n  );\n}", modalCode);

fs.writeFileSync('src/components/PublicComments.tsx', content);
