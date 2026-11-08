const fs = require('fs');
let code = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

// 1. Add postType state and delete function
const statePattern = `  const [showPoll, setShowPoll] = useState(false);`;
const stateReplacement = `  const [postType, setPostType] = useState<'text' | 'poll'>('text');`;
code = code.replace(statePattern, stateReplacement);

const deleteImportPattern = `import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';`;
const deleteImportReplacement = `import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';`;
code = code.replace(deleteImportPattern, deleteImportReplacement);

const effectPattern = `  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'));`;

const handleActionsFunc = `
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('دڵنیایت دەتەوێت ئەم پۆستە بسڕیتەوە؟')) return;
    try {
      await deleteDoc(doc(db, 'public_comments', commentId));
    } catch (e) {
      console.error('Error deleting comment: ', e);
    }
  };

`;
code = code.replace(effectPattern, handleActionsFunc + effectPattern);

// 2. Adjust submit to use postType
const submitValidationPattern = `const validOptions = pollOptions.filter(o => o.trim());
      if (showPoll && pollQuestion.trim() && validOptions.length >= 2) {`;
const submitValidationReplacement = `const validOptions = pollOptions.filter(o => o.trim());
      if (postType === 'poll' && pollQuestion.trim() && validOptions.length >= 2) {`;
code = code.replace(submitValidationPattern, submitValidationReplacement);

const submitResetPattern = `      setNewComment('');
      setShowPoll(false);
      setPollQuestion('');
      setPollOptions(['', '']);`;
const submitResetReplacement = `      setNewComment('');
      setPollQuestion('');
      setPollOptions(['', '']);
      setPostType('text');`;
code = code.replace(submitResetPattern, submitResetReplacement);

const disabledConditionPattern = `disabled={(!newComment.trim() && !pollQuestion.trim()) || loading || !currentUser}`;
const disabledConditionReplacement = `disabled={(postType === 'text' && !newComment.trim()) || (postType === 'poll' && (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2)) || loading || !currentUser}`;
code = code.replace(disabledConditionPattern, disabledConditionReplacement);

// 3. Update Composer UI
const composerPattern = `<div className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-custom border border-surface-border">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="بیر لە چی دەکەیتەوە؟ لێرە بینووسە..."
            className="w-full bg-surface-bg border border-surface-border rounded-[16px] md:rounded-[20px] p-3 md:p-4 text-[12px] md:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[80px] md:min-h-[100px] resize-none"
            disabled={loading || !currentUser}
          />
          {showPoll && (`;

const composerReplacement = `<div className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-custom border border-surface-border">
        
        {/* Tabs for Post Type */}
        <div className="flex gap-2 mb-4 border-b border-surface-border pb-3">
          <button
            type="button"
            onClick={() => setPostType('text')}
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-colors \${postType === 'text' ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-50'}\`}
          >
            <Icon icon="fluent:comment-24-regular" className="inline-block rtl:ml-1 ltr:mr-1" />
            بۆچوون
          </button>
          <button
            type="button"
            onClick={() => setPostType('poll')}
            className={\`px-4 py-2 rounded-xl text-sm font-bold transition-colors \${postType === 'poll' ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-50'}\`}
          >
            <Icon icon="hugeicons:task-check-01" className="inline-block rtl:ml-1 ltr:mr-1" />
            ڕاپرسی
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {postType === 'text' && (
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="بیر لە چی دەکەیتەوە؟ لێرە بینووسە..."
              className="w-full bg-surface-bg border border-surface-border rounded-[16px] md:rounded-[20px] p-3 md:p-4 text-[12px] md:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[80px] md:min-h-[100px] resize-none"
              disabled={loading || !currentUser}
            />
          )}
          {postType === 'poll' && (`;

code = code.replace(composerPattern, composerReplacement);

const showPollButtonPattern = `<button 
              type="button"
              onClick={() => setShowPoll(!showPoll)}
              className={\`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] md:text-sm font-medium transition-colors \${showPoll ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-100'}\`}
            >
              <Icon icon="hugeicons:task-check-01" width={18} />
              {showPoll ? 'لابردنی هەڵبژاردن' : 'زیادکردنی هەڵبژاردن (Poll)'}
            </button>`;

const showPollButtonReplacement = `<div></div>`;
code = code.replace(showPollButtonPattern, showPollButtonReplacement);

// 4. Add Delete button to comments
const commentHeaderPattern = `<span className="text-[12px] text-neutral-500" dir="ltr">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                  </div>`;

const commentHeaderReplacement = `<span className="text-[12px] text-neutral-500" dir="ltr">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                  </div>
                  {(currentUser?.id === comment.userId || currentUser?.roles.includes('Admin')) && (
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="سڕینەوە"
                    >
                      <Icon icon="hugeicons:delete-02" width={18} />
                    </button>
                  )}`;

code = code.replace(commentHeaderPattern, commentHeaderReplacement);

fs.writeFileSync('src/components/PublicComments.tsx', code);
