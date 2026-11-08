import re

with open('src/components/Layout.tsx', 'r') as f:
    content = f.read()

# Add event listener
new_effect = """  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const handleOpenSettings = () => setShowProfileModal(true);
    window.addEventListener('open-profile-settings', handleOpenSettings);
    return () => window.removeEventListener('open-profile-settings', handleOpenSettings);
  }, []);"""

content = content.replace("  const [showProfileModal, setShowProfileModal] = useState(false);", new_effect)

# Also need to import useEffect if not already
if "import { useState }" in content:
    content = content.replace("import { useState }", "import { useState, useEffect }")
elif "import React, { useState }" in content:
    content = content.replace("import React, { useState }", "import React, { useState, useEffect }")
elif "import { useState," in content:
    pass # already there
else:
    content = content.replace("import React from 'react';", "import React, { useEffect } from 'react';")

# Remove onClick from mobile header avatar
content = content.replace('onClick={() => setShowProfileModal(true)}', '')

with open('src/components/Layout.tsx', 'w') as f:
    f.write(content)
