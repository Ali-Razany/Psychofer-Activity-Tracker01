import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

new_imports = """import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { BADGE_INFO } from '../lib/badges';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Comment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ku } from 'date-fns/locale';"""

content = content.replace("import React from 'react';\nimport { useAppContext } from '../store/AppContext';\nimport { Icon } from '@iconify/react';\nimport { BADGE_INFO } from '../lib/badges';\nimport { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';", new_imports)

# insert state and effect
state_effect = """  const [recentComments, setRecentComments] = useState<Comment[]>([]);

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

content = content.replace("  const { currentUser, users, logs, departments, activities } = useAppContext();\n\n  if (!currentUser) return null;", "  const { currentUser, users, logs, departments, activities } = useAppContext();\n\n" + state_effect + "\n\n  if (!currentUser) return null;")

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
