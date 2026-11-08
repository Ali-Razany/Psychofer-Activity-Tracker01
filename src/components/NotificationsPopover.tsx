import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../store/AppContext';
import { format } from 'date-fns';

export function NotificationsPopover() {
  const { notifications, currentUser, markNotificationRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications
    .filter(n => n.userId === currentUser?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = userNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={() => {
          if (!isOpen) {
            userNotifications.filter(n => !n.read).forEach(n => handleMarkRead(n.id));
          }
          setIsOpen(!isOpen);
        }}
        className="relative p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
      >
        <Icon icon="solar:bell-outline" width={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[12px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto bg-surface-paper border border-surface-border rounded-[24px] shadow-custom z-50">
          <div className="p-4 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface-paper">
            <h3 className="text-[14px] font-bold text-neutral-800">ئاگادارکردنەوەکان</h3>
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
          </div>
          
          <div className="divide-y divide-slate-100">
            {userNotifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 text-[12px] sm:text-sm">
                هیچ ئاگادارکردنەوەیەک نییە
              </div>
            ) : (
              userNotifications.map(notif => (
                <div 
                  key={notif.id} 
                  className={`p-4 flex gap-3 transition-colors cursor-pointer ${notif.read ? 'bg-surface-paper' : 'bg-primary-light/30 hover:bg-primary-light/50'}`}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkRead(notif.id);
                    }
                  }}
                >
                  <div className="mt-0.5">
                    <Icon icon="hugeicons:information-circle" width={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notif.read ? 'text-neutral-600' : 'text-neutral-900 font-medium'}`}>
                      {notif.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(notif.date).toLocaleDateString('ku')}
                    </p>
                  </div>
                  {!notif.read && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMarkRead(notif.id); }}
                      className="text-primary hover:bg-primary-light/20 p-1.5 rounded-md self-start"
                      title="خوێندراوە"
                    >
                      <Icon icon="hugeicons:checkmark" width={18} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
