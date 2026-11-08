import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetEditInput = `<input value={editName} onChange={e => setEditName(e.target.value)} disabled={currentUser?.role !== 'Admin'} className="flex-1 px-3 py-1 bg-white border border-blue-300 rounded-lg" />`;
const newEditInput = `<input value={editName} onChange={e => setEditName(e.target.value)} disabled={currentUser?.role !== 'Admin'} className="flex-1 px-3 py-1 bg-white border border-blue-300 rounded-lg" placeholder="ناو" />
                <input value={editJobTitle} onChange={e => setEditJobTitle(e.target.value)} disabled={currentUser?.role !== 'Admin'} className="flex-1 px-3 py-1 bg-white border border-blue-300 rounded-lg text-sm" placeholder="پیشە" />`;

code = code.replace(targetEditInput, newEditInput);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
