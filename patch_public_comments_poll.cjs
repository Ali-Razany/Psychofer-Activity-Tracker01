const fs = require('fs');
let code = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

// 1. Add Poll State
const statePattern = `const [newComment, setNewComment] = useState('');`;
const stateReplacement = `${statePattern}
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);`;
code = code.replace(statePattern, stateReplacement);

// 2. Add Poll to Submit Logic
const submitPattern = `      await addDoc(collection(db, 'public_comments'), {
        userId: currentUser.id,
        content: newComment.trim(),
        timestamp: new Date().toISOString()
      });
      setNewComment('');`;

const submitReplacement = `      const postData: any = {
        userId: currentUser.id,
        content: newComment.trim(),
        timestamp: new Date().toISOString()
      };
      
      const validOptions = pollOptions.filter(o => o.trim());
      if (showPoll && pollQuestion.trim() && validOptions.length >= 2) {
        postData.poll = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, i) => ({
            id: 'opt_' + i,
            text: opt.trim(),
            votes: []
          }))
        };
      }

      await addDoc(collection(db, 'public_comments'), postData);
      setNewComment('');
      setShowPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);`;
code = code.replace(submitPattern, submitReplacement);


// 3. Add handleVote function inside component
const effectPattern = `  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'));`;

const handleVoteFunc = `
  const handleVote = async (commentId: string, optionId: string) => {
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    
    // Optimistic update can be tricky with complex nested objects in Firestore without transactions if doing client-side.
    // For simplicity, we'll fetch the document, update the poll array, and save.
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !comment.poll) return;

    const newOptions = comment.poll.options.map(opt => {
      // Remove user from all options first
      let votes = opt.votes.filter(id => id !== currentUser.id);
      // Add user to selected option
      if (opt.id === optionId) {
        votes.push(currentUser.id);
      }
      return { ...opt, votes };
    });

    try {
      await updateDoc(commentRef, {
        'poll.options': newOptions
      });
    } catch (e) {
      console.error('Error voting: ', e);
    }
  };

`;
code = code.replace(effectPattern, handleVoteFunc + effectPattern);

// 4. Update the Form UI
const formPattern = `          <div className="flex justify-end">
            <button
              type="submit"`;

const formReplacement = `          {showPoll && (
            <div className="bg-neutral-50 rounded-xl p-3 md:p-4 mb-2 space-y-3 border border-neutral-200">
              <input
                type="text"
                placeholder="پرسیارەکە بنووسە..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-[12px] p-2 text-sm focus:outline-none focus:border-primary"
              />
              <div className="space-y-2">
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={\`هەڵبژاردەی \${i + 1}\`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollOptions];
                        newOpts[i] = e.target.value;
                        setPollOptions(newOpts);
                      }}
                      className="flex-1 bg-white border border-neutral-300 rounded-[12px] p-2 text-sm focus:outline-none focus:border-primary"
                    />
                    {i >= 2 && (
                      <button type="button" onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="text-red-500 p-2">
                        <Icon icon="hugeicons:delete-02" width={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={() => setPollOptions([...pollOptions, ''])}
                className="text-[12px] font-bold text-primary flex items-center gap-1 mt-2"
              >
                <Icon icon="hugeicons:plus-sign" /> هەڵبژاردەی زیاتر
              </button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <button 
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] md:text-sm font-medium transition-colors \${showPoll ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-100'}\`}
            >
              <Icon icon="hugeicons:task-check-01" width={18} />
              {showPoll ? 'لابردنی هەڵبژاردن' : 'زیادکردنی هەڵبژاردن (Poll)'}
            </button>
            <button
              type="submit"`;

code = code.replace(formPattern, formReplacement);

// Fix the disabled condition to account for poll
const disablePattern = `disabled={!newComment.trim() || loading || !currentUser}`;
const disableReplacement = `disabled={(!newComment.trim() && !pollQuestion.trim()) || loading || !currentUser}`;
code = code.replace(disablePattern, disableReplacement);


// 5. Update the rendering of comments to show the poll
const contentPattern = `                    <div className="text-[12px] sm:text-[14px] md:text-base text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium">
                      {comment.content}
                    </div>`;

const contentReplacement = `                    <div className="text-[12px] sm:text-[14px] md:text-base text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium">
                      {comment.content}
                    </div>
                    {comment.poll && (
                      <div className="mt-4 bg-white border border-neutral-200 rounded-xl p-4">
                        <h4 className="font-bold text-sm md:text-base mb-3 text-neutral-900">{comment.poll.question}</h4>
                        <div className="space-y-2">
                          {(() => {
                            const totalVotes = comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);
                            const userVotedId = comment.poll.options.find(o => o.votes.includes(currentUser?.id || ''))?.id;
                            
                            return comment.poll.options.map((opt) => {
                              const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                              const isSelected = opt.id === userVotedId;
                              
                              if (userVotedId) {
                                // Show results
                                return (
                                  <div key={opt.id} className="relative overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50 p-2 sm:p-3 cursor-pointer" onClick={() => handleVote(comment.id, opt.id)}>
                                    <div className={\`absolute top-0 bottom-0 left-0 transition-all duration-500 \${isSelected ? 'bg-primary/20' : 'bg-neutral-200/50'}\`} style={{ width: \`\${pct}%\` }}></div>
                                    <div className="relative z-10 flex justify-between items-center text-[12px] sm:text-sm">
                                      <span className={\`font-medium \${isSelected ? 'text-primary-dark font-bold' : 'text-neutral-700'}\`}>
                                        {isSelected && <Icon icon="hugeicons:tick-01" className="inline-block rtl:ml-1 ltr:mr-1" />}
                                        {opt.text}
                                      </span>
                                      <span className="text-neutral-500 font-bold">{pct}%</span>
                                    </div>
                                  </div>
                                );
                              } else {
                                // Show voting buttons
                                return (
                                  <button
                                    key={opt.id}
                                    onClick={() => handleVote(comment.id, opt.id)}
                                    className="w-full text-right p-2 sm:p-3 rounded-lg border border-neutral-200 hover:border-primary hover:bg-primary/5 transition-colors text-[12px] sm:text-sm font-medium text-neutral-700 hover:text-primary"
                                  >
                                    {opt.text}
                                  </button>
                                );
                              }
                            });
                          })()}
                        </div>
                        <div className="mt-2 text-[10px] sm:text-xs text-neutral-400">
                          کۆی دەنگەکان: {comment.poll.options.reduce((sum, opt) => sum + opt.votes.length, 0)}
                        </div>
                      </div>
                    )}`;

code = code.replace(contentPattern, contentReplacement);


fs.writeFileSync('src/components/PublicComments.tsx', code);
