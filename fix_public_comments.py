import re

with open('src/components/PublicComments.tsx', 'r') as f:
    content = f.read()

# Add new imports
new_imports = """import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ku } from 'date-fns/locale';"""
content = content.replace("import React, { useState, useEffect } from 'react';\nimport { useAppContext } from '../store/AppContext';\nimport { Icon } from '@iconify/react';\nimport { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';\nimport { db } from '../lib/firebase';\nimport { Comment } from '../types';", new_imports)

# Add states for replying
state_injection = """  const [loading, setLoading] = useState(false);
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
  };"""
content = content.replace("  const [loading, setLoading] = useState(false);", state_injection)

# Replace the comments map
old_map = """      <div className="space-y-4">
        {comments.map(comment => {
          const user = users.find(u => u.id === comment.userId);
          return (
            <div key={comment.id} className="bg-surface-paper p-6 rounded-[24px] shadow-sm border border-surface-border hover:shadow-custom transition-shadow">
              <div className="flex items-start gap-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <h3 className="font-bold text-neutral-800 text-sm truncate">{user?.name || 'نەناسراو'}</h3>
                    <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                      {new Date(comment.timestamp).toLocaleString('ku-IQ', {
                        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          );
        })}"""

new_map = """      <div className="space-y-4">
        {comments.map(comment => {
          const user = users.find(u => u.id === comment.userId);
          const likes = comment.likes || [];
          const replies = comment.replies || [];
          const isLiked = likes.includes(currentUser?.id || '');
          
          return (
            <div key={comment.id} className="bg-surface-paper p-6 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:shadow-custom transition-shadow">
              <div className="flex items-start gap-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h3 className="font-bold text-neutral-800 text-sm truncate">{user?.name || 'نەناسراو'}</h3>
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap" dir="ltr">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true, locale: ku })}
                    </span>
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed whitespace-pre-wrap mb-4">{comment.content}</p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-surface-border">
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
                            <div className="flex-1 bg-surface-paper p-3 rounded-[16px] rounded-tr-none border border-surface-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-neutral-800">{replyUser?.name || 'نەناسراو'}</span>
                                <span className="text-[10px] text-neutral-400" dir="ltr">{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true, locale: ku })}</span>
                              </div>
                              <p className="text-xs text-neutral-600 whitespace-pre-wrap">{reply.content}</p>
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
                          placeholder="کۆمێنتەکەت لێرە بنووسە..."
                          className="w-full bg-surface-bg border border-surface-border rounded-[16px] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="bg-primary text-white p-3 rounded-[16px] hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Icon icon="fluent:send-24-filled" width={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}"""

content = content.replace(old_map, new_map)

with open('src/components/PublicComments.tsx', 'w') as f:
    f.write(content)

