import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetNewUserInput = `<input 
          type="text" placeholder="ناوی بەکارهێنەر" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />`;
const newNewUserInput = `<input 
          type="text" placeholder="ناوی بەکارهێنەر" value={newUserName} onChange={(e) => setNewUserName(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <input 
          type="text" placeholder="پیشە یان پلە (ئارەزوومەندانە)" value={newUserJobTitle} onChange={(e) => setNewUserJobTitle(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />`;

code = code.replace(targetNewUserInput, newNewUserInput);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
