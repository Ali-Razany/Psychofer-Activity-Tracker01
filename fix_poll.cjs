const fs = require('fs');
let code = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

// 1. Fix handleSubmit
const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    
    setLoading(true);
    try {
      const postData: any = {
        userId: currentUser.id,
        content: newComment.trim(),
        timestamp: new Date().toISOString()
      };
      
      const validOptions = pollOptions.filter(o => o.trim());
      if (postType === 'poll' && pollQuestion.trim() && validOptions.length >= 2) {
        postData.poll = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, i) => ({
            id: 'opt_' + i,
            text: opt.trim(),
            votes: []
          }))
        };
      }`;

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const validOptions = pollOptions.filter(o => o.trim());
    if (postType === 'text' && !newComment.trim()) return;
    if (postType === 'poll' && (!pollQuestion.trim() || validOptions.length < 2)) return;
    
    setLoading(true);
    try {
      const postData: any = {
        userId: currentUser.id,
        content: postType === 'text' ? newComment.trim() : '',
        timestamp: new Date().toISOString()
      };
      
      if (postType === 'poll') {
        postData.poll = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, i) => ({
            id: 'opt_' + i,
            text: opt.trim(),
            votes: []
          }))
        };
      }`;

code = code.replace(oldHandleSubmit, newHandleSubmit);


// 2. Fix rendering
const oldRender = `                  <p className="text-neutral-700 text-[12px] md:text-sm leading-[19.5px] md:leading-relaxed whitespace-pre-wrap mb-3 md:mb-4">{comment.content}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-surface-border relative">`;

const newRender = `                  {comment.content && (
                    <p className="text-neutral-700 text-[12px] md:text-sm leading-[19.5px] md:leading-relaxed whitespace-pre-wrap mb-3 md:mb-4">{comment.content}</p>
                  )}
                  {comment.poll && (
                    <div className="mb-4 bg-surface-paper border border-surface-border shadow-sm rounded-[16px] p-4">
                      <h4 className="font-bold text-sm md:text-base mb-4 text-neutral-900">{comment.poll.question}</h4>
                      <div className="space-y-2">
                        {(() => {
                          const totalVotes = comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                          const userVotedId = comment.poll.options.find(o => o.votes.includes(currentUser?.id || ''))?.id;
                          
                          return comment.poll.options.map((opt) => {
                            const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                            const isSelected = opt.id === userVotedId;
                            
                            if (userVotedId) {
                              return (
                                <div key={opt.id} className="relative overflow-hidden rounded-[12px] border border-surface-border bg-surface-bg p-3 cursor-pointer group" onClick={() => handleVote(comment.id, opt.id)}>
                                  <div className={\`absolute top-0 bottom-0 left-0 transition-all duration-500 \${isSelected ? 'bg-primary/20' : 'bg-neutral-200'}\`} style={{ width: \`\${pct}%\` }}></div>
                                  <div className="relative z-10 flex justify-between items-center text-[12px] sm:text-sm">
                                    <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-primary-dark font-bold' : 'text-neutral-700 group-hover:text-primary'}\`}>
                                      {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[16px] text-primary" />}
                                      {opt.text}
                                    </span>
                                    <span className="text-neutral-500 font-bold">{pct}%</span>
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => handleVote(comment.id, opt.id)}
                                  className="w-full text-right p-3 rounded-[12px] border border-surface-border hover:border-primary hover:bg-primary/5 transition-colors text-[12px] sm:text-sm font-medium text-neutral-700 hover:text-primary"
                                >
                                  {opt.text}
                                </button>
                              );
                            }
                          });
                        })()}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[10px] sm:text-[12px] text-neutral-400 font-medium">
                        <Icon icon="solar:users-group-rounded-bold" />
                        کۆی دەنگەکان: {comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-surface-border relative">`;

code = code.replace(oldRender, newRender);

fs.writeFileSync('src/components/PublicComments.tsx', code);
