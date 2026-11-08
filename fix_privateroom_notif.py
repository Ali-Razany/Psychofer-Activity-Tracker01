import re

with open('src/components/PrivateRoom.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const { currentUser, departments, users } = useAppContext();",
    "const { currentUser, departments, users, addNotification } = useAppContext();"
)

old_send = """    try {
      await sendRoomMessage(selectedDeptId, currentUser.id, newMessage.trim());
      setNewMessage('');
    } catch (err) {"""

new_send = """    try {
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
    } catch (err) {"""

content = content.replace(old_send, new_send)

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.write(content)
