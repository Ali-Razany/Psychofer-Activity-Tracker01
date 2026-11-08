import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# Add viewProfileId to useAppContext
content = content.replace("const { currentUser, users, departments, activities, logs, awardBadge } = useAppContext();", "const { currentUser, users, departments, activities, logs, awardBadge, viewProfileId, setViewProfileId } = useAppContext();")

# Update useEffect
use_effect = """
  useEffect(() => {
    if (viewProfileId) {
      const userToView = users.find(u => u.id === viewProfileId);
      if (userToView) {
        setSelectedUser(userToView);
        setViewProfileId(null);
      }
    }
  }, [viewProfileId, users, setViewProfileId]);

  useEffect(() => {
    const handleOpenUserProfile = (e: CustomEvent) => {
"""

content = content.replace("useEffect(() => {\n    const handleOpenUserProfile = (e: CustomEvent) => {", use_effect)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
