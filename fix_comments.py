import re

with open('src/components/PublicComments.tsx', 'r') as f:
    content = f.read()

# Make sure setViewProfileId is imported
content = content.replace("const { currentUser, users } = useAppContext();", "const { currentUser, users, setViewProfileId } = useAppContext();")

navigate_func = """
  const navigateToProfile = (userId: string) => {
    setViewProfileId(userId);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };
"""

content = content.replace("const handleAddReply = async (commentId: string) => {", navigate_func + "\n  const handleAddReply = async (commentId: string) => {")

comment_avatar = """
              <div className="flex items-start gap-4">
                <div className="cursor-pointer" onClick={() => navigateToProfile(comment.userId)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-neutral-800 cursor-pointer hover:underline" onClick={() => navigateToProfile(comment.userId)}>{user?.name || 'نەناسراو'}</h4>
"""

content = re.sub(
    r'<div className="flex items-start gap-4">\s*\{user\?\.avatar \? \(\s*<img src=\{user\.avatar\} alt=\{user\?\.name\} className="w-12 h-12 rounded-full object-cover border border-surface-border shrink-0" />\s*\) : \(\s*<div className="w-12 h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">\s*\{user\?\.name\?\.charAt\(0\) \|\| \'\?\'\}\s*</div>\s*\)\}\s*<div className="flex-1 min-w-0">\s*<div className="flex items-center justify-between mb-1">\s*<h4 className="font-bold text-neutral-800">\{user\?\.name \|\| \'نەناسراو\'\}</h4>',
    comment_avatar,
    content,
    flags=re.DOTALL
)

reply_avatar = """
                          <div key={reply.id} className="flex gap-3">
                            <div className="cursor-pointer" onClick={() => navigateToProfile(reply.userId)}>
                            {replyUser?.avatar ? (
                              <img src={replyUser.avatar} alt={replyUser.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            ) : (
                              <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                {replyUser?.name.charAt(0) || '?'}
                              </div>
                            )}
                            </div>
                            <div className="bg-white p-3 rounded-[20px] rounded-tr-sm border border-surface-border flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-xs text-neutral-800 cursor-pointer hover:underline" onClick={() => navigateToProfile(reply.userId)}>{replyUser?.name || 'نەناسراو'}</span>
"""

content = re.sub(
    r'<div key=\{reply\.id\} className="flex gap-3">\s*\{replyUser\?\.avatar \? \(\s*<img src=\{replyUser\.avatar\} alt=\{replyUser\.name\} className="w-8 h-8 rounded-full object-cover shrink-0" />\s*\) : \(\s*<div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shrink-0">\s*\{replyUser\?\.name\.charAt\(0\) \|\| \'\?\'\}\s*</div>\s*\)\}\s*<div className="bg-white p-3 rounded-\[20px\] rounded-tr-sm border border-surface-border flex-1">\s*<div className="flex justify-between items-start mb-1">\s*<span className="font-bold text-xs text-neutral-800">\{replyUser\?\.name \|\| \'نەناسراو\'\}</span>',
    reply_avatar,
    content,
    flags=re.DOTALL
)

with open('src/components/PublicComments.tsx', 'w') as f:
    f.write(content)

