import fs from 'fs';

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const targetSignature = `updateUserAdmin: (id: string, n: string, r: Role, d: string, t?: string) => void`;
const newSignature = `updateUserAdmin: (id: string, n: string, r: Role, d: string, jt?: string, t?: string) => void`;
code = code.replace(targetSignature, newSignature);

const targetAddUserCall = `await addUser(newUserEmail, newUserPass, {
          name: newUserName,
          role: newUserRole,
          department: newUserDept,
          points: 0
        });`;
const newAddUserCall = `await addUser(newUserEmail, newUserPass, {
          name: newUserName,
          role: newUserRole,
          department: newUserDept,
          jobTitle: newUserJobTitle,
          points: 0
        });`;
code = code.replace(targetAddUserCall, newAddUserCall);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
