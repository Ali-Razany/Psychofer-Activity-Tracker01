import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

if "react-hot-toast" not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { Toaster } from 'react-hot-toast';")
    content = content.replace("<AppContextProvider>", "<AppContextProvider>\n      <Toaster position=\"top-center\" />")
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Toaster added")
else:
    print("Toaster already exists")
