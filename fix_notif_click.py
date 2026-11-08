import re

with open('src/components/NotificationsPopover.tsx', 'r') as f:
    content = f.read()

old_notif_item = """                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-3 transition-colors ${notif.read ? 'bg-surface-paper' : 'bg-primary/10/50'}`}
                >"""

new_notif_item = """                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-3 transition-colors cursor-pointer ${notif.read ? 'bg-surface-paper' : 'bg-primary-light/30 hover:bg-primary-light/50'}`}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkRead(notif.id);
                    }
                  }}
                >"""

content = content.replace(old_notif_item, new_notif_item)

with open('src/components/NotificationsPopover.tsx', 'w') as f:
    f.write(content)
