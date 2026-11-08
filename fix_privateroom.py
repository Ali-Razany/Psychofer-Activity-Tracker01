import re

with open('src/components/PrivateRoom.tsx', 'r') as f:
    content = f.read()

# Make sure setViewProfileId is imported
content = content.replace("const { currentUser, departments, users } = useAppContext();", "const { currentUser, departments, users, setViewProfileId } = useAppContext();")

navigate_func = """
  const navigateToProfile = (userId: string) => {
    setViewProfileId(userId);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };
"""

content = content.replace("const [newMessage, setNewMessage] = useState('');", "const [newMessage, setNewMessage] = useState('');\n" + navigate_func)

msg_avatar = """
                  <div className="cursor-pointer" onClick={() => navigateToProfile(msg.userId)}>
                  {msgUser?.avatar ? (
                    <img src={msgUser.avatar} alt={msgUser.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-neutral-600 text-xs">
                      {msgUser?.name?.charAt(0) || '?'}
                    </div>
                  )}
                  </div>
"""

content = re.sub(
    r'<div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-neutral-600 text-xs">\s*\{msgUser\?\.name\?\.charAt\(0\) \|\| \'\?\'\}\s*</div>',
    msg_avatar,
    content,
    flags=re.DOTALL
)

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.write(content)

