import re

with open('src/store/AppContext.tsx', 'r') as f:
    content = f.read()

old_add_activity = """  const addActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
  };"""

new_add_activity = """  const addActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
    
    // Notify users in that department
    const deptUsers = rawUsers.filter(u => u.departments.includes(activity.department));
    for (const u of deptUsers) {
      if (u.id !== currentUser?.id) {
        addNotification(u.id, `چالاکییەکی نوێ بەناوی "${activity.name}" بۆ بەشەکەت زیادکرا.`, 'new_task').catch(console.error);
      }
    }
  };"""

content = content.replace(old_add_activity, new_add_activity)

old_update_activity = """  const updateActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
  };"""

new_update_activity = """  const updateActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
    // Notify users in that department
    const deptUsers = rawUsers.filter(u => u.departments.includes(activity.department));
    for (const u of deptUsers) {
      if (u.id !== currentUser?.id) {
        addNotification(u.id, `زانیاری چالاکی "${activity.name}" نوێکرایەوە.`, 'task_updated').catch(console.error);
      }
    }
  };"""
  
content = content.replace(old_update_activity, new_update_activity)

with open('src/store/AppContext.tsx', 'w') as f:
    f.write(content)
