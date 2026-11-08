import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

# Add handleOpenMyProfile
new_effect = """  const [showProfileModal, setShowProfileModal] = useState(false);

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
  };"""

content = content.replace("  const [showProfileModal, setShowProfileModal] = useState(false);\n\n  useEffect(() => {\n    const handleOpenSettings = () => setShowProfileModal(true);\n    window.addEventListener('open-profile-settings', handleOpenSettings);\n    return () => window.removeEventListener('open-profile-settings', handleOpenSettings);\n  }, []);", new_effect)

# Replace the onClick placeholders
content = content.replace('        <div className="flex items-center gap-3 cursor-pointer" >\n          {currentUser.avatar ? (', '        <div className="flex items-center gap-3 cursor-pointer" onClick={handleOpenMyProfile}>\n          {currentUser.avatar ? (')
content = content.replace('        <div className="p-6 border-b border-surface-border items-center justify-between gap-3 hidden md:flex cursor-pointer hover:bg-surface-bg transition-colors" >\n          <div className="flex items-center gap-3">\n            {currentUser.avatar ? (', '        <div className="p-6 border-b border-surface-border items-center justify-between gap-3 hidden md:flex cursor-pointer hover:bg-surface-bg transition-colors" onClick={handleOpenMyProfile}>\n          <div className="flex items-center gap-3">\n            {currentUser.avatar ? (')

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Add useEffect import if needed
if "import React, { useState }" in content:
    content = content.replace("import React, { useState }", "import React, { useState, useEffect }")

# Add the useEffect
new_effect_profile = """  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');

  useEffect(() => {
    const handleOpenUserProfile = (e: any) => {
      const userId = e.detail?.userId;
      if (userId) {
        const userToSelect = users.find(u => u.id === userId);
        if (userToSelect) {
          setSelectedUser(userToSelect);
        }
      }
    };
    
    window.addEventListener('open-user-profile', handleOpenUserProfile);
    return () => window.removeEventListener('open-user-profile', handleOpenUserProfile);
  }, [users]);"""

content = content.replace("  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');", new_effect_profile)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
