import re

with open('src/components/NotificationsPopover.tsx', 'r') as f:
    content = f.read()

old_button = """      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
      >"""

new_button = """      <button 
        onClick={() => {
          if (!isOpen) {
            userNotifications.filter(n => !n.read).forEach(n => handleMarkRead(n.id));
          }
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
      >"""

content = content.replace(old_button, new_button)

with open('src/components/NotificationsPopover.tsx', 'w') as f:
    f.write(content)
