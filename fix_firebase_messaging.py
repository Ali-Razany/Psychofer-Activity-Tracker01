import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

content = content.replace("import { getFirestore } from 'firebase/firestore';", "import { getFirestore } from 'firebase/firestore';\nimport { getMessaging, isSupported } from 'firebase/messaging';")

content += """
let messaging: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}
export { messaging };
"""

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
