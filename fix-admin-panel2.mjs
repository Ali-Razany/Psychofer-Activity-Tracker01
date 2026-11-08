import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetState = `  const [newUserDept, setNewUserDept] = useState(currentUser?.role === 'Supervisor' ? currentUser.department : (departments[0]?.id || ''));`;
const newState = targetState + `\n  const [newUserJobTitle, setNewUserJobTitle] = useState('');`;

code = code.replace(targetState, newState);

const targetEditState = `  const [editPassword, setEditPassword] = useState('');`;
const newEditState = targetEditState + `\n  const [editJobTitle, setEditJobTitle] = useState('');`;

code = code.replace(targetEditState, newEditState);

const targetStartEdit = `    setEditDept(u.department);
    setEditPassword('');
    setEditTelegramId(u.telegramChatId || '');`;
const newStartEdit = `    setEditDept(u.department);
    setEditJobTitle(u.jobTitle || '');
    setEditPassword('');
    setEditTelegramId(u.telegramChatId || '');`;

code = code.replace(targetStartEdit, newStartEdit);

const targetUpdateUserAdminCall = `updateUserAdmin(u.id, editName, editRole, editDept, editTelegramId);`;
const newUpdateUserAdminCall = `updateUserAdmin(u.id, editName, editRole, editDept, editJobTitle, editTelegramId);`;

code = code.replace(targetUpdateUserAdminCall, newUpdateUserAdminCall);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
