import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

old_award = """    await updateDoc(doc(db, 'users', userId), {
      badges: [...currentBadges, badge]
    });
  };"""

new_award = """    await updateDoc(doc(db, 'users', userId), {
      badges: [...currentBadges, badge]
    });
    addNotification(userId, 'پیرۆزە! باجێکی نوێت پێدرا لەسەر چالاکییەکانت.', 'new_badge').catch(console.error);
  };"""

content = content.replace(old_award, new_award)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
