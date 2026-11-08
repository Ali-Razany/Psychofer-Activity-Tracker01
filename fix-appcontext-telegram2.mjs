import fs from 'fs';
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

// AppContextType
code = code.replace(
  /updateUserAdmin: \(userId: string, name: string, role: Role, department: string\) => Promise<void>;/,
  "updateUserAdmin: (userId: string, name: string, role: Role, department: string, telegramChatId?: string) => Promise<void>;"
);

// function definition
code = code.replace(
  /const updateUserAdmin = async \(userId: string, name: string, role: Role, department: string\) => \{/,
  "const updateUserAdmin = async (userId: string, name: string, role: Role, department: string, telegramChatId?: string) => {"
);

// updateDoc call
code = code.replace(
  /await updateDoc\(doc\(db, 'users', userId\), \{ name, role, department \}\);/,
  "await updateDoc(doc(db, 'users', userId), { name, role, department, telegramChatId: telegramChatId || '' });"
);

fs.writeFileSync('src/store/AppContext.tsx', code);
