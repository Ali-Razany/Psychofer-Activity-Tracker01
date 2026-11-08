import re

with open('src/components/NotificationsPopover.tsx', 'r') as f:
    content = f.read()

old_button = """                  {!notif.read && (
                    <button 
                      onClick={() => handleMarkRead(notif.id)}
                      className="text-primary hover:bg-primary-light/20 p-1.5 rounded-md self-start"
                      title="خوێندراوە"
                    >
                      <Icon icon="hugeicons:checkmark" width={18} />
                    </button>
                  )}"""

new_button = """                  {!notif.read && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                      className="text-primary hover:bg-primary-light/20 p-1.5 rounded-md self-start"
                      title="خوێندراوە"
                    >
                      <Icon icon="hugeicons:checkmark" width={18} />
                    </button>
                  )}"""

content = content.replace(old_button, new_button)

with open('src/components/NotificationsPopover.tsx', 'w') as f:
    f.write(content)
