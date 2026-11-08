import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { RoomMessage } from '../types';

export const subscribeToRoom = (departmentId: string, callback: (messages: RoomMessage[]) => void) => {
  const q = query(
    collection(db, 'room_messages'),
    where('departmentId', '==', departmentId)
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as RoomMessage));
    
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    callback(messages);
  });
};

export const sendRoomMessage = async (departmentId: string, userId: string, content: string) => {
  return await addDoc(collection(db, 'room_messages'), {
    departmentId,
    userId,
    content,
    timestamp: new Date().toISOString(),
    reactions: {}
  });
};

export const toggleReaction = async (messageId: string, emoji: string, userId: string) => {
  const messageRef = doc(db, 'room_messages', messageId);
  const messageSnap = await getDoc(messageRef);
  
  if (messageSnap.exists()) {
    const data = messageSnap.data();
    const reactions = data.reactions || {};
    
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }
    
    if (reactions[emoji].includes(userId)) {
      reactions[emoji] = reactions[emoji].filter((id: string) => id !== userId);
      if (reactions[emoji].length === 0) {
        delete reactions[emoji];
      }
    } else {
      reactions[emoji].push(userId);
    }
    
    await updateDoc(messageRef, { reactions });
  }
};
