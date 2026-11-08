import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace useAppContext in Dashboard
content = content.replace("const { currentUser, users, logs, departments, activities } = useAppContext();", "const { currentUser, users, logs, departments, activities, setViewProfileId } = useAppContext();")

# Avatar clicks in Dashboard
# 1. Comment author avatar
comment_avatar = """
                    <div className="relative z-10 flex items-center gap-3 mb-4">
                      <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(author?.id || null); onNavigate('profiles'); }}>
                      {author?.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 backdrop-blur-sm">
                          {author?.name.charAt(0) || '?'}
                        </div>
                      )}
                      </div>
                      <div className="min-w-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(author?.id || null); onNavigate('profiles'); }}>
                        <h4 className="font-bold text-white text-base truncate hover:underline">{author?.name || 'نەناسراو'}</h4>
"""
content = re.sub(
    r'<div className="relative z-10 flex items-center gap-3 mb-4">\s*\{author\?\.avatar \? \(\s*<img src=\{author\.avatar\} alt=\{author\.name\} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shrink-0" />\s*\) : \(\s*<div className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm shrink-0 backdrop-blur-sm">\s*\{author\?\.name\.charAt\(0\) \|\| \'\?\'\}\s*</div>\s*\)\}\s*<div className="min-w-0">\s*<h4 className="font-bold text-white text-base truncate">\{author\?\.name \|\| \'نەناسراو\'\}</h4>',
    comment_avatar,
    content
)

# 2. Leaderboard avatars
leaderboard_avatar = """
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  {index === 0 ? (
                    <Icon icon="fluent-emoji:1st-place-medal" width={32} />
                  ) : index === 1 ? (
                    <Icon icon="fluent-emoji:2nd-place-medal" width={32} />
                  ) : index === 2 ? (
                    <Icon icon="fluent-emoji:3rd-place-medal" width={32} />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white border border-surface-border flex items-center justify-center text-sm font-bold text-neutral-500 shadow-sm">
                      {index + 1}
                    </div>
                  )}
                </div>
                
                <div className="cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(user.id); onNavigate('profiles'); }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full object-cover shrink-0 ${index < 3 ? 'border-2 border-white shadow-sm' : 'border border-surface-border'}`} />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${index < 3 ? 'border-2 border-white shadow-sm bg-white text-primary' : 'bg-surface-border text-neutral-600'}`}>
                    {user.name.charAt(0)}
                  </div>
                )}
                </div>
                
                <div className="flex-1 min-w-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); setViewProfileId(user.id); onNavigate('profiles'); }}>
                  <p className={`text-sm font-bold truncate hover:underline ${index === 0 ? 'text-amber-900' : index === 1 ? 'text-slate-800' : index === 2 ? 'text-orange-900' : 'text-neutral-800'}`}>
"""

content = re.sub(
    r'<div className="w-10 h-10 flex items-center justify-center shrink-0">.*?</div>\s*\{user\.avatar \? \(\s*<img src=\{user\.avatar\} alt=\{user\.name\} className=\{`w-10 h-10 rounded-full object-cover shrink-0 \$\{index < 3 \? \'border-2 border-white shadow-sm\' : \'border border-surface-border\'\}`\} />\s*\) : \(\s*<div className=\{`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 \$\{index < 3 \? \'border-2 border-white shadow-sm bg-white text-primary\' : \'bg-surface-border text-neutral-600\'\}`\}>\s*\{user\.name\.charAt\(0\)\}\s*</div>\s*\)\}\s*<div className="flex-1 min-w-0">\s*<p className=\{`text-sm font-bold truncate \$\{index === 0 \? \'text-amber-900\' : index === 1 \? \'text-slate-800\' : index === 2 \? \'text-orange-900\' : \'text-neutral-800\'\}`\}>',
    leaderboard_avatar,
    content,
    flags=re.DOTALL
)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

