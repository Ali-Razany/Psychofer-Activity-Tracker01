import re

with open('src/components/BooksList.tsx', 'r') as f:
    content = f.read()

content = content.replace("deleteDoc, serverTimestamp", "deleteDoc, serverTimestamp, updateDoc")
content = re.sub(r"import \{ updateDoc \} from 'firebase/firestore'; // Note: updateDoc is already imported at the top\n", "", content)

with open('src/components/BooksList.tsx', 'w') as f:
    f.write(content)
