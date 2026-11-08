import React from 'react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { AuthScreen } from './AuthScreen';
import { NotificationsPopover } from './NotificationsPopover';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { Icon } from '@iconify/react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { currentUser, logout, departments, loading } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleOpenSettings = () => setShowProfileModal(true);
    window.addEventListener('open-profile-settings', handleOpenSettings);
    return () => window.removeEventListener('open-profile-settings', handleOpenSettings);
  }, []);

  const handleOpenMyProfile = () => {
    setActiveTab('profiles');
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-user-profile', { detail: { userId: currentUser?.id } }));
    }, 100);
  };

  if (loading) {
    return <div className="min-h-screen bg-surface-bg flex items-center justify-center font-sans">لە بارکردندایە...</div>;
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'داشبۆرد', icon: <Icon icon="hugeicons:grid-view" width={20} /> },
    { id: 'add-activity', label: 'تۆمارکردنی چالاکی', icon: <Icon icon="hugeicons:book-open-01" width={20} /> },
    { id: 'profiles', label: 'پڕۆفایلەکان', icon: <Icon icon="mynaui:user-hexagon" width={20} /> },
    { id: 'departments', label: 'دەستەکان', icon: <Icon icon="hugeicons:building-03" width={20} /> },
    { id: "public-comments", label: "دیوەخانی گشتی", icon: <Icon icon="fluent-emoji:speech-balloon" width={20} /> },
    { id: "articles", label: "بابەتەکان", icon: <Icon icon="fluent-emoji:memo" width={20} /> },
    { id: "books", label: "بەرهەمە چاپکراوەکانمان", icon: <Icon icon="fluent-emoji:books" width={20} /> },
    { id: "about", label: "دەربارەی ئێمە", icon: <Icon icon="solar:info-circle-bold-duotone" width={20} /> }
  ];
  
  if (!(currentUser.roles || []).includes('DepartmentRep')) {
    menuItems.push({ id: 'room', label: 'ژووری تایبەت', icon: <Icon icon="mage:message-dots" width={20} /> });
  }
  
  // DepartmentRep (نوێنەری بەش) can also see reports, so it should be visible to them and higher roles,
  // Actually reports can be seen by everyone but they see their own, but let's keep it generally visible.
  menuItems.push({ id: 'reports', label: 'ڕاپۆرتەکان', icon: <Icon icon="hugeicons:chart-bar-01" width={20} /> });

  if ((currentUser.roles || []).some(r => ['Admin', 'AssistantAdmin', 'Supervisor'].includes(r))) {
    menuItems.push({ id: 'approvals', label: 'پەسەندکردن', icon: <Icon icon="hugeicons:task-done-01" width={20} /> });
  }

  if ((currentUser.roles || []).some(r => ['Admin', 'Supervisor'].includes(r))) {
    menuItems.push({ id: 'admin', label: (currentUser.roles || []).includes('Admin') ? 'بەڕێوەبردن' : 'دەستەکەم', icon: <Icon icon="hugeicons:settings-01" width={20} /> });
  }

  return (
    <div className="h-screen bg-surface-bg flex flex-col md:flex-row rtl font-sans overflow-hidden" dir="rtl">
      {/* Mobile Header */}
      <div className="md:hidden bg-surface-paper border-b border-surface-border p-4 flex items-center justify-between z-20 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          <div className="cursor-pointer" onClick={handleOpenMyProfile}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border border-surface-border shadow-sm shrink-0" />
            ) : (
              <div className="w-9 h-9 bg-primary-light/20 rounded-full flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-100">
            <Icon icon="fluent-emoji:sports-medal" width={14} />
            <span>{currentUser.points || 0} خاڵ</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
          >
            {theme === 'dark' ? <Icon icon="hugeicons:sun-01" width={22} /> : <Icon icon="hugeicons:moon-02" width={22} />}
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors"
          >
            <Icon icon="hugeicons:home-01" width={22} />
          </button>
          <NotificationsPopover />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
          >
            {isMobileMenuOpen ? <Icon icon="mynaui:x" width={20} /> : <Icon icon="clarity:menu-line" width={20} />}
          </button>
        </div>
      </div>
      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 right-0 z-40 w-64 bg-surface-paper border-l border-surface-border flex flex-col shadow-custom md:shadow-[0_2px_10px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-surface-border items-center justify-between gap-3 hidden md:flex cursor-pointer hover:bg-surface-bg transition-colors" onClick={handleOpenMyProfile}>
          <div className="flex items-center gap-3">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border border-surface-border shadow-sm shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center text-primary font-bold shadow-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-[14px] font-bold text-neutral-800 truncate">{currentUser.name}</h1>
              <p className="text-xs text-neutral-500 truncate">{(currentUser.roles || []).includes('Admin') ? 'سەرپەرشتیاری گشتی' : (currentUser.roles || []).includes('AssistantAdmin') ? 'یاریدەدەری سەرپەرشتیار' : (currentUser.roles || []).includes('DepartmentRep') ? 'نوێنەری بەش' : (currentUser.roles || []).includes('Supervisor') ? 'سەرپەرشتیاری دەستە' : 'ئەندام'}</p>
            </div>
          </div>
        </div>
        {/* Mobile Sidebar Close Button Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between md:hidden">
          <h2 className="text-[14px] font-bold text-neutral-800">مێنیۆ</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-neutral-500 bg-surface-border rounded-full">
            <Icon icon="mynaui:x" width={18} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-[20px] text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary-dark' 
                    : 'text-neutral-600 hover:bg-surface-bg hover:text-neutral-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-surface-border">
          <button 
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[20px] text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <Icon icon="mynaui:logout" width={20} />
            چوونە دەرەوە
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        <header className="bg-surface-paper border-b border-surface-border px-8 py-4 flex items-center justify-between sticky top-0 z-10 hidden md:flex">
          <div className="flex items-center gap-4">
            <h2 className="text-[14px] md:text-xl font-semibold text-neutral-800">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full text-[12px] sm:text-sm font-medium border border-amber-100">
              <Icon icon="fluent-emoji:sports-medal" width={18} />
              <span>{currentUser.points || 0} خاڵ</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
              title="گۆڕینی ڕەنگ"
            >
              {theme === 'dark' ? <Icon icon="hugeicons:sun-01" width={22} /> : <Icon icon="hugeicons:moon-02" width={22} />}
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors bg-primary-light/10"
              title="گەڕانەوە بۆ داشبۆرد"
            >
              <Icon icon="hugeicons:home-01" width={22} />
            </button>
            <NotificationsPopover />
          </div>
        </header>
        <div className={`flex-1 overflow-auto ${activeTab === 'profiles' ? '' : 'p-4 md:p-8'}`}>
          <div className={activeTab === 'profiles' ? 'h-full' : 'max-w-6xl mx-auto'}>
            {children}
          </div>
        </div>
      </main>
      
      {showProfileModal && currentUser && (
        <ProfileSettingsModal 
          user={currentUser} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}
