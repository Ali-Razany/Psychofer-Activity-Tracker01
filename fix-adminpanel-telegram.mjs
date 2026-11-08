import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add editTelegramId state
code = code.replace(
  /const \[editPassword, setEditPassword\] = useState\(''\);/,
  "const [editPassword, setEditPassword] = useState('');\n  const [editTelegramId, setEditTelegramId] = useState('');"
);

// startEdit
code = code.replace(
  /setEditPassword\(''\);\n  \};/,
  "setEditPassword('');\n    setEditTelegramId(u.telegramChatId || '');\n  };"
);

// updateUserAdmin args
code = code.replace(
  /updateUserAdmin: \(id: string, n: string, r: Role, d: string\) => void,/,
  "updateUserAdmin: (id: string, n: string, r: Role, d: string, t?: string) => void,"
);

// AppContext.tsx needs updateUserAdmin to take telegramChatId
code = code.replace(
  /updateUserAdmin\(u\.id, editName, editRole, editDept\);/,
  "updateUserAdmin(u.id, editName, editRole, editDept, editTelegramId);"
);

// Render input for editing telegram id
code = code.replace(
  /<input type="text" placeholder="پاسۆردی نوێ \(گەر دەیگۆڕیت\)"/,
  "<input type=\"text\" placeholder=\"ئایدی تێلیگرام\" value={editTelegramId} onChange={e => setEditTelegramId(e.target.value)} disabled={currentUser?.role !== 'Admin'} className=\"flex-1 px-3 py-1 bg-white border border-blue-300 rounded-lg text-sm\" />\n                <input type=\"text\" placeholder=\"پاسۆردی نوێ (گەر دەیگۆڕیت)\""
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
