import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { sendRoomMessage, subscribeToRoom, toggleReaction } from '../lib/roomService';
import { RoomMessage } from '../types';
import { Icon } from '@iconify/react';

export function PrivateRoom() {
  const { currentUser, departments, users, addNotification, notifications, markNotificationRead } = useAppContext();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const navigateToProfile = (userId: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: { tab: "profiles" } })); setTimeout(() => window.dispatchEvent(new CustomEvent("open-user-profile", { detail: { id: userId } })), 100);;
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'rules'>('chat');
  const [blogContent, setBlogContent] = useState('');
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Determine which department room to show based on role

  // Supervisor/Member -> their own department
  // AssistantAdmin/Admin -> can select department, default to first or their own
  const [selectedDeptId, setSelectedDeptId] = useState<string>((currentUser?.departments?.[0] || "") || '');

  const canSelectDept = (currentUser?.roles || []).includes('Admin') || (currentUser?.roles || []).includes('AssistantAdmin');
  const roomMembers = users.filter(u => (u.departments || []).includes(selectedDeptId)).sort((a, b) => b.points - a.points);
  const isSupervisor = (currentUser?.roles || []).includes('Supervisor') && (currentUser.departments || []).includes(selectedDeptId);
  const isAdmin = (currentUser?.roles || []).includes('Admin') || (currentUser?.roles || []).includes('AssistantAdmin');
  const canEditBlog = isSupervisor || isAdmin;
  const deptName = departments.find(d => d.id === selectedDeptId)?.name || "نەناسراو";


  useEffect(() => {
    if (!selectedDeptId) return;
    
    // Check permission
    if (!canSelectDept && (currentUser?.departments?.[0] || "") !== selectedDeptId) {
       return; // Unauthorized
    }

    // Mark room message notifications as read
    const roomNotifs = notifications.filter(n => 
      n.userId === currentUser?.id && 
      !n.read && 
      n.type === 'room_message' &&
      n.message.includes(deptName)
    );
    roomNotifs.forEach(n => markNotificationRead(n.id));

    const unsubscribe = subscribeToRoom(selectedDeptId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedDeptId, currentUser, canSelectDept, notifications, markNotificationRead, deptName]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    
    setLoading(true);
    try {
      const sentMsg = newMessage.trim();
      await sendRoomMessage(selectedDeptId, currentUser.id, sentMsg);
      setNewMessage('');
      
      // Notify other members
      const deptName = departments.find(d => d.id === selectedDeptId)?.name || 'بەش';
      roomMembers.forEach(member => {
        if (member.id !== currentUser.id) {
          addNotification(member.id, `نامەیەکی نوێ لە ژووری ${deptName} لەلایەن ${currentUser.name}ەوە هات.`, 'room_message').catch(console.error);
        }
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getSenderName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'نەناسراو';
  };

  const currentDeptName = departments.find(d => d.id === selectedDeptId)?.name || 'بەش';

  if (!currentUser) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-surface-paper rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border overflow-hidden">
      {/* Header */}
      <div className="bg-surface-bg border-b border-surface-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-[20px]">
            <Icon icon="hugeicons:lock-key" width={18} />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-neutral-800">ژووری تایبەتی {currentDeptName}</h2>
            <p className="text-xs text-neutral-500">تەنیا ئەندامانی دەستەکەی خۆت و سەرپەرشتیاران دەتوانن ئێرە ببینن.</p>
          </div>
        </div>
        
        {canSelectDept && (
          <select 
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="bg-surface-paper border border-surface-border rounded-[20px] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-bg/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Icon icon="hugeicons:lock-key" width={18} />
            <p>ژوورەکە بەتاڵە. یەکەم نامە بنێرە.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === currentUser.id;
            const EMOJIS = ['👍', '❤️', '😂', '🔥', '🎉'];
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group relative`}>
                <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-neutral-600 text-xs">
                    <Icon icon="hugeicons:user-circle-02" width={18} />
                  </div>
                  <div className={`px-4 py-3 rounded-[28px] relative ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-surface-paper border border-surface-border text-neutral-800 rounded-bl-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                  }`}>
                    {!isMe && <p className="text-[12px] sm:text-xs font-medium mb-1 opacity-75 text-indigo-600">{getSenderName(msg.userId)}</p>}
                    <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[12px] mt-2 flex justify-between ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString('ku-IQ', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    
                    {/* Reactions Display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className={`absolute ${isMe ? '-left-2' : '-right-2'} -bottom-3 flex gap-1 z-10`}>
                        {Object.entries(msg.reactions).map(([emoji, userIdsValue]) => {
                          const userIds = userIdsValue as string[];
                          const reactNames = userIds.map(id => getSenderName(id)).join(', ');
                          return (
                            <button 
                              key={emoji}
                              title={reactNames}
                              onClick={() => toggleReaction(msg.id, emoji, currentUser.id)}
                              className={`text-[12px] bg-white border border-surface-border shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-1 transition-transform hover:scale-110 ${userIds.includes(currentUser.id) ? 'bg-indigo-50 border-indigo-200' : ''}`}
                            >
                              <span>{emoji}</span>
                              <span className="text-neutral-500 font-bold">{userIds.length}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Reaction Picker (Hover) */}
                <div className={`absolute top-0 ${isMe ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-20`}>
                  <div className="bg-white border border-surface-border shadow-md rounded-full px-2 py-1 flex gap-1">
                    {EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(msg.id, emoji, currentUser.id)}
                        className="hover:scale-125 transition-transform text-sm"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-surface-paper border-t border-surface-border">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="نامەیەک بنووسە..."
            className="flex-1 bg-surface-bg border border-surface-border rounded-[20px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
            className="bg-indigo-600 text-white px-5 rounded-[20px] hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <Icon icon="hugeicons:sent" width={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
