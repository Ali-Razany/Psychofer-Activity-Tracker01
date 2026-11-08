import re

with open('src/components/PrivateRoom.tsx', 'r') as f:
    content = f.read()

old_useeffect = """  useEffect(() => {
    if (!selectedDeptId) return;
    
    // Check permission
    if (!canSelectDept && (currentUser?.departments?.[0] || "") !== selectedDeptId) {
       return; // Unauthorized
    }

    const unsubscribe = subscribeToRoom(selectedDeptId, (msgs) => {
      setMessages(msgs);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedDeptId, currentUser, canSelectDept]);"""

new_useeffect = """  const { notifications, markNotificationRead } = useAppContext();

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
  }, [selectedDeptId, currentUser, canSelectDept, notifications, markNotificationRead, deptName]);"""

content = content.replace(old_useeffect, new_useeffect)

# Need to make sure useAppContext has notifications and markNotificationRead
content = content.replace(
    "const { currentUser, departments, users, addNotification } = useAppContext();",
    "const { currentUser, departments, users, addNotification, notifications, markNotificationRead } = useAppContext();"
)

# wait, we injected it already in new_useeffect, let's just do it cleanly

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.write(content)
