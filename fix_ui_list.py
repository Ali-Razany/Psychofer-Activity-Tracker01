import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div className="relative mb-3">\n                  \{user\.avatar \? \(\n                    <img src=\{user\.avatar\}.*?/>\n                  \) : \(\n                    <div className=".*?>\n                      \{user\.name\.charAt\(0\)\}\n                    </div>\n                  \)\}', re.DOTALL)

new_content = """<div className="relative mb-3">
                  <div className="p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full inline-block shadow-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className={`${isSmall ? 'w-16 h-16' : 'w-24 h-24'} rounded-full object-cover border-[3px] border-white shrink-0`} />
                    ) : (
                      <div className={`${isSmall ? 'w-16 h-16 text-2xl' : 'w-24 h-24 text-4xl'} bg-primary-light/30 text-primary rounded-full flex items-center justify-center font-bold border-[3px] border-white group-hover:scale-105 transition-transform shrink-0`}>
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>"""

if pattern.search(content):
    content = pattern.sub(new_content, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success small")
else:
    print("Pattern not found small")

pattern2 = re.compile(r'<div className="relative">\n                  \{user\.avatar \? \(\n                    <img src=\{user\.avatar\}.*?/>\n                  \) : \(\n                    <div className=".*?>\n                      \{user\.name\.charAt\(0\)\}\n                    </div>\n                  \)\}', re.DOTALL)

new_content2 = """<div className="relative">
                  <div className="p-[3px] bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full inline-block shadow-sm">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shrink-0" />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-light to-primary-light/50 text-primary-dark rounded-full flex items-center justify-center font-bold text-xl border-2 border-white shrink-0 group-hover:scale-105 transition-transform">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>"""

if pattern2.search(content):
    content = pattern2.sub(new_content2, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success list")
else:
    print("Pattern not found list")

