const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Add handleVote inside Dashboard component
const reactionPattern = `  const handleReaction = async (e: React.MouseEvent, commentId: string, emoji: string, currentReactions: Record<string, string[]> = {}, likes: string[] = []) => {`;
const voteHandler = `
  const handleVote = async (e: React.MouseEvent, commentId: string, optionId: string) => {
    e.stopPropagation();
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    const comment = recentComments.find(c => c.id === commentId);
    if (!comment || !comment.poll) return;

    const newOptions = comment.poll.options.map(opt => {
      let votes = opt.votes.filter(id => id !== currentUser.id);
      if (opt.id === optionId) {
        votes.push(currentUser.id);
      }
      return { ...opt, votes };
    });

    try {
      await updateDoc(commentRef, {
        'poll.options': newOptions
      });
    } catch (error) {
      console.error('Error voting from dashboard: ', error);
    }
  };

`;
code = code.replace(reactionPattern, voteHandler + reactionPattern);

// 2. Adjust Card Height dynamically
// Change fixed container height
code = code.replace(
  '<div className="relative w-full h-[250px] mb-8">',
  '<div className="relative w-full h-[320px] mb-8">'
);

// Modify the inner card heights and styling
code = code.replace(
  'className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] p-6 md:p-8 shadow-custom relative overflow-hidden flex flex-col h-[220px] ${isTop ? \'cursor-pointer hover:shadow-lg transition-shadow\' : \'pointer-events-none\'}`}',
  'className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[24px] p-6 md:p-8 shadow-custom relative overflow-hidden flex flex-col h-[280px] ${isTop ? \'cursor-pointer hover:shadow-lg transition-shadow\' : \'pointer-events-none\'}`}'
);

// 3. Render Poll
const contentPattern = `                    <p className="text-white/90 text-[12px] md:text-xs leading-relaxed line-clamp-3 mb-auto relative z-10 whitespace-pre-wrap flex-1">
                      {comment.content}
                    </p>`;

const contentReplacement = `                    {comment.content && (
                      <p className={\`text-white/90 text-[12px] md:text-xs leading-relaxed whitespace-pre-wrap relative z-10 \${comment.poll ? 'line-clamp-2 mb-2 flex-none' : 'line-clamp-3 mb-auto flex-1'}\`}>
                        {comment.content}
                      </p>
                    )}
                    
                    {comment.poll && (
                      <div className="relative z-10 bg-white/10 border border-white/20 rounded-[16px] p-3 mb-auto flex-1 overflow-y-auto custom-scrollbar min-h-[100px]">
                        <h4 className="font-bold text-xs md:text-sm mb-2 text-white">{comment.poll.question}</h4>
                        <div className="space-y-1.5">
                          {(() => {
                            const totalVotes = comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                            const userVotedId = comment.poll.options.find(o => o.votes.includes(currentUser?.id || ''))?.id;
                            
                            return comment.poll.options.map((opt) => {
                              const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                              const isSelected = opt.id === userVotedId;
                              
                              if (userVotedId) {
                                return (
                                  <div key={opt.id} className="relative overflow-hidden rounded-[8px] border border-white/20 bg-black/20 p-2 cursor-pointer group" onClick={(e) => handleVote(e, comment.id, opt.id)}>
                                    <div className={\`absolute top-0 bottom-0 left-0 transition-all duration-500 \${isSelected ? 'bg-white/30' : 'bg-white/10'}\`} style={{ width: \`\${pct}%\` }}></div>
                                    <div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs">
                                      <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}\`}>
                                        {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[14px]" />}
                                        <span className="truncate max-w-[120px]">{opt.text}</span>
                                      </span>
                                      <span className="text-white/80 font-bold">{pct}%</span>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={(e) => handleVote(e, comment.id, opt.id)}
                                    className="w-full text-right p-2 rounded-[8px] border border-white/20 hover:bg-white/10 transition-colors text-[10px] sm:text-xs font-medium text-white/80 hover:text-white truncate"
                                  >
                                    {opt.text}
                                  </button>
                                );
                              }
                            });
                          })()}
                        </div>
                      </div>
                    )}`;

code = code.replace(contentPattern, contentReplacement);

// Fix empty state height
code = code.replace(
  'className="bg-surface-paper border border-dashed border-surface-border rounded-[24px] h-[220px] flex flex-col items-center justify-center text-neutral-500"',
  'className="bg-surface-paper border border-dashed border-surface-border rounded-[24px] h-[280px] flex flex-col items-center justify-center text-neutral-500"'
);

fs.writeFileSync('src/components/Dashboard.tsx', code);
