import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';
import { getTimeAgoKurdish } from '../lib/dateUtils';


export function PublicComments() {
  const { currentUser, users, setViewProfileId } = useAppContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postType, setPostType] = useState<'text' | 'poll'>('text');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [reactionsDetails, setReactionsDetails] = useState<{commentId: string, reactions: Record<string, string[]>} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{type: 'comment' | 'reply', commentId: string, replyId?: string} | null>(null);
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
  };

  const handleReplySubmit = async (commentId: string) => {
    if (!replyText.trim() || !currentUser) return;
    
    const commentRef = doc(db, 'public_comments', commentId);
    const newReply = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: replyText.trim(),
      timestamp: new Date().toISOString()
    };
    
    try {
      await updateDoc(commentRef, {
        replies: arrayUnion(newReply)
      });
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply: ", error);
    }
  };


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


  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'comment') {
        await deleteDoc(doc(db, 'public_comments', deleteConfirm.commentId));
      } else if (deleteConfirm.type === 'reply' && deleteConfirm.replyId) {
        const commentRef = doc(db, 'public_comments', deleteConfirm.commentId);
        const comment = comments.find(c => c.id === deleteConfirm.commentId);
        if (comment) {
          const updatedReplies = comment.replies.filter(r => r.id !== deleteConfirm.replyId);
          await updateDoc(commentRef, { replies: updatedReplies });
        }
      }
    } catch (e) {
      console.error('Error deleting: ', e);
    } finally {
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(data);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
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
      }

      await addDoc(collection(db, 'public_comments'), postData);
      setNewComment('');
      setPollQuestion('');
      setPollOptions(['', '']);
      setPostType('text');
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] p-4 md:p-6 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-[12px] md:rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
            <Icon icon="fluent-emoji:speech-balloon" className="text-[24px] md:text-[36px]" />
          </div>
          <div>
            <h2 className="text-[14px] md:text-2xl font-bold mb-0.5">دیوەخانی گشتی</h2>
            <p className="text-white/80 text-[12px] md:text-base">لێرە دەتوانیت بە ئازادی قسەی دڵی خۆت بکەیت و لەگەڵ هاوڕێکانتدا گفتوگۆ بکەیت.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-custom border border-surface-border">
        
        {/* Tabs for Post Type */}
        <div className="flex gap-2 mb-4 border-b border-surface-border pb-3">
          <button
            type="button"
            onClick={() => setPostType('text')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${postType === 'text' ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-50'}`}
          >
            <Icon icon="fluent:comment-24-regular" className="inline-block rtl:ml-1 ltr:mr-1" />
            بۆچوون
          </button>
          <button
            type="button"
            onClick={() => setPostType('poll')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${postType === 'poll' ? 'bg-primary/10 text-primary' : 'text-neutral-500 hover:bg-neutral-50'}`}
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
          {postType === 'poll' && (
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
                      placeholder={`هەڵبژاردەی ${i + 1}`}
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
            <div></div>
            <button
              type="submit"
              disabled={(postType === 'text' && !newComment.trim()) || (postType === 'poll' && (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2)) || loading || !currentUser}
              className="bg-primary text-white px-4 py-1.5 md:px-6 md:py-2.5 text-[12px] md:text-base leading-[14px] md:leading-normal rounded-[16px] md:rounded-[20px] font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5 md:gap-2 shadow-sm"
            >
              {loading ? <Icon icon="eos-icons:loading" className="text-[14px] md:text-[20px] animate-spin" /> : <Icon icon="fluent:send-24-filled" className={`text-[14px] md:text-[20px] ${document.dir === 'rtl' ? 'rotate-180' : ''}`} />}
              بڵاوکردنەوە
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {comments.map(comment => {
          const user = users.find(u => u.id === comment.userId);
          const likes = comment.likes || [];
          const replies = comment.replies || [];
          const isLiked = likes.includes(currentUser?.id || '');
          
          return (
            <div key={comment.id} className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:shadow-custom transition-shadow">
              <div className="flex items-start gap-3 md:gap-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-[12px] sm:text-sm md:text-lg shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                      <h3 className="text-[14px] font-bold text-neutral-800 md:text-sm truncate w-full sm:w-auto">{user?.name || 'نەناسراو'}</h3>
                      <span className="text-[12px] md:text-[11px] text-neutral-500 whitespace-nowrap text-right" dir="rtl">
                        {getTimeAgoKurdish(comment.timestamp)}
                      </span>
                    </div>
                    {currentUser?.id === comment.userId && (
                      <button 
                        onClick={() => setDeleteConfirm({ type: 'comment', commentId: comment.id })} 
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 shrink-0"
                        title="سڕینەوە"
                      >
                        <Icon icon="solar:trash-bin-trash-bold-duotone" width={18} />
                      </button>
                    )}
                  </div>
                  {comment.content && (
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
                                  <div className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${isSelected ? 'bg-primary/20' : 'bg-neutral-200'}`} style={{ width: `${pct}%` }}></div>
                                  <div className="relative z-10 flex justify-between items-center text-[12px] sm:text-sm">
                                    <span className={`font-medium flex items-center gap-1.5 ${isSelected ? 'text-primary-dark font-bold' : 'text-neutral-700 group-hover:text-primary'}`}>
                                      {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[16px] text-primary" />}
                                      {opt.text}
                                    </span>
                                    <span className="text-neutral-500 font-bold">{pct}%</span>
                                  </div>
                                  {opt.votes.length > 0 && (
                                    <div className="relative z-10 flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-black/5">
                                      {opt.votes.map(voterId => {
                                        const voter = users.find(u => u.id === voterId);
                                        if (!voter) return null;
                                        return (
                                          <div key={voterId} className="flex items-center gap-1 bg-white/70 px-1.5 py-0.5 rounded border border-neutral-200/60 shadow-sm" title={voter.name}>
                                            {voter.avatar ? <img src={voter.avatar} className="w-4 h-4 rounded-full object-cover"/> : <div className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[8px] font-bold">{voter.name.charAt(0)}</div>}
                                            <span className="text-[10px] text-neutral-600 truncate max-w-[60px] font-medium">{voter.name.split(' ')[0]}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
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
                  
                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-surface-border relative">
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
                    
                    {Object.keys({ ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }).length > 0 && (
                      <button 
                        onClick={() => setReactionsDetails({commentId: comment.id, reactions: { ...comment.reactions, ...((likes.length > 0 && !comment.reactions?.['❤️']) ? {'❤️': likes} : {}) }})}
                        className="text-[11px] text-neutral-400 hover:text-primary underline px-1"
                      >
                        (بینین)
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold transition-colors mr-auto px-3 py-1.5 rounded-full ${replyingTo === comment.id ? 'bg-primary-light/20 text-primary' : 'text-neutral-500 hover:bg-surface-bg'}`}
                    >
                      <Icon icon="fluent:comment-24-regular" width={16} />
                      {replies.length} کۆمێنت
                    </button>
                  </div>
                  
                  {/* Replies List */}
                  {replies.length > 0 && (
                    <div className="mt-4 space-y-3 bg-surface-bg p-4 rounded-[20px] border border-surface-border">
                      {replies.map(reply => {
                        const replyUser = users.find(u => u.id === reply.userId);
                        return (
                          <div key={reply.id} className="flex gap-3">
                            {replyUser?.avatar ? (
                              <img src={replyUser.avatar} alt={replyUser.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                {replyUser?.name.charAt(0) || '?'}
                              </div>
                            )}
                            <div className="flex-1 bg-surface-paper p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] rounded-tr-none border border-surface-border">
                              <div className="flex items-center justify-between mb-0.5 md:mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[12px] md:text-xs text-neutral-800">{replyUser?.name || 'نەناسراو'}</span>
                                  <span className="text-[12px] md:text-[10px] text-neutral-400" dir="rtl">{getTimeAgoKurdish(reply.timestamp)}</span>
                                </div>
                                {currentUser?.id === reply.userId && (
                                  <button 
                                    onClick={() => setDeleteConfirm({ type: 'reply', commentId: comment.id, replyId: reply.id })} 
                                    className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 shrink-0"
                                    title="سڕینەوە"
                                  >
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" width={14} />
                                  </button>
                                )}
                              </div>
                              <p className="text-[12px] md:text-xs text-neutral-600 whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 flex gap-3 items-end">
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="بۆچوونەکەت لێرە بینووسە..."
                          className="w-full bg-surface-bg border border-surface-border rounded-[12px] md:rounded-[16px] p-2 md:p-3 text-[12px] md:text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[50px] md:min-h-[60px] resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="bg-primary text-white p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Icon icon="fluent:send-24-filled" className={`text-[16px] md:text-[20px] ${document.dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {comments.length === 0 && (
          <div className="text-center py-12 text-neutral-500 bg-surface-paper rounded-[24px] border border-dashed border-surface-border">
            <Icon icon="fluent-emoji:ghost" width={48} className="mx-auto mb-3 opacity-50" />
            <p>هێشتا هیچ بۆچوونێک نییە.</p>
          </div>
        )}
      </div>

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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-surface-paper rounded-[32px] p-6 shadow-2xl border border-surface-border text-center"
              dir="rtl"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold" width={32} />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">دڵنیایت؟</h3>
              <p className="text-neutral-500 mb-6">
                دڵنیایت دەتەوێت ئەم {deleteConfirm.type === 'comment' ? 'پۆستە' : 'بۆچوونە'} بسڕیتەوە؟ ئەم کارە پاشگەزبوونەوەی تێدانییە.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-sm transition-colors"
                >
                  سڕینەوە
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

