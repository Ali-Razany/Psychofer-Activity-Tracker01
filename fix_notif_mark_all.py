import re

with open('src/components/NotificationsPopover.tsx', 'r') as f:
    content = f.read()

old_header = """          <div className="p-4 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface-paper">
            <h3 className="font-bold text-neutral-800">ئاگادارکردنەوەکان</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                {unreadCount} نوێ
              </span>
            )}
          </div>"""

new_header = """          <div className="p-4 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface-paper">
            <h3 className="font-bold text-neutral-800">ئاگادارکردنەوەکان</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button 
                  onClick={() => {
                    userNotifications.filter(n => !n.read).forEach(n => handleMarkRead(n.id));
                  }}
                  className="text-xs text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer ml-2"
                >
                  هەمووی وەک خوێندراوە دیاری بکە
                </button>
              )}
              {unreadCount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} نوێ
                </span>
              )}
            </div>
          </div>"""

content = content.replace(old_header, new_header)

with open('src/components/NotificationsPopover.tsx', 'w') as f:
    f.write(content)
