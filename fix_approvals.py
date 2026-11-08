import re

with open('src/components/Approvals.tsx', 'r') as f:
    content = f.read()

# Make sure setViewProfileId is imported
content = content.replace("const { currentUser, logs, updateLogStatus, users, activities, departments } = useAppContext();", "const { currentUser, logs, updateLogStatus, users, activities, departments, setViewProfileId } = useAppContext();")

navigate_func = """
  const navigateToProfile = (userId: string) => {
    setViewProfileId(userId);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };
"""

content = content.replace("const pendingLogs = logs.filter(", navigate_func + "\n  const pendingLogs = logs.filter(")

approvals_user = """
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-800 cursor-pointer hover:underline" onClick={() => navigateToProfile(log.userId)}>{user?.name}</span>
"""

content = re.sub(
    r'<div className="flex items-center gap-2 mb-1">\s*<span className="font-bold text-neutral-800">\{user\?\.name\}</span>',
    approvals_user,
    content,
    flags=re.DOTALL
)

with open('src/components/Approvals.tsx', 'w') as f:
    f.write(content)

