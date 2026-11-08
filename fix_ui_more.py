import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(r'<div className="flex justify-center -mt-16 relative z-10">.*?</div>\n            \n            <div className="text-center px-6 pb-8 md:pb-10 mt-3">', re.DOTALL)

new_content = """<div className="flex justify-center -mt-16 relative z-10">
              <div className="p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 rounded-full shadow-lg">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white object-cover bg-white shrink-0" />
                ) : (
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white bg-gradient-to-br from-primary-light to-primary-light/50 flex items-center justify-center font-bold text-5xl text-primary-dark shrink-0">
                    {selectedUser.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center px-6 pb-8 md:pb-10 mt-4">"""

if pattern.search(content):
    content = pattern.sub(new_content, content)
    with open('src/components/ProfilesList.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Pattern not found")

