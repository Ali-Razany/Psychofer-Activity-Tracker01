import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_state = """  const [recentComments, setRecentComments] = useState<Comment[]>([]);

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

  const handleLike = async (e: React.MouseEvent, commentId: string, likes: string[] = []) => {
    e.stopPropagation();
    if (!currentUser) return;
    const commentRef = doc(db, 'public_comments', commentId);
    if (likes.includes(currentUser.id)) {
      await updateDoc(commentRef, { likes: arrayRemove(currentUser.id) });
    } else {
      await updateDoc(commentRef, { likes: arrayUnion(currentUser.id) });
    }
  };"""

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

content = content.replace(old_state, new_state)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
