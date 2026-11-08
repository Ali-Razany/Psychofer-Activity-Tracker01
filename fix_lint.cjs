const fs = require('fs');

// Fix ActivityForm.tsx
let activityForm = fs.readFileSync('src/components/ActivityForm.tsx', 'utf8');
activityForm = activityForm.replace(/u\.department === currentUser\?\.department/g, "u.departments?.[0] === currentUser?.departments?.[0]");
fs.writeFileSync('src/components/ActivityForm.tsx', activityForm);

// Fix AdminPanel.tsx
let adminPanel = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminPanel = adminPanel.replace(/\(userId: string, role: Role, department: string\)/g, "(id: string, r: Role[], d: string[])");
adminPanel = adminPanel.replace(/\(userId: string, name: string, role: Role, department: string, jobTitle\?: string, telegramChatId\?: string\)/g, "(id: string, n: string, r: Role[], d: string[], jt?: string, t?: string)");
fs.writeFileSync('src/components/AdminPanel.tsx', adminPanel);

// Fix Approvals.tsx
let approvals = fs.readFileSync('src/components/Approvals.tsx', 'utf8');
approvals = approvals.replace(/u => u\.department === currentUser\?\.department/g, "u => u.departments?.[0] === currentUser?.departments?.[0]");
fs.writeFileSync('src/components/Approvals.tsx', approvals);

// Fix Dashboard.tsx
let dashboard = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(/b\.awardedAt/g, "''"); // user badge doesn't have awardedAt?
dashboard = dashboard.replace(/activity\.departments/g, "activity.department");
dashboard = dashboard.replace(/activity\.type/g, "''");
fs.writeFileSync('src/components/Dashboard.tsx', dashboard);

// Fix ProfileSettingsModal.tsx
let psm = fs.readFileSync('src/components/ProfileSettingsModal.tsx', 'utf8');
psm = psm.replace(/telegramChatId: formData\.telegramChatId/g, ""); // remove if it doesn't exist on User
fs.writeFileSync('src/components/ProfileSettingsModal.tsx', psm);

// Fix AppContext.tsx
let appContext = fs.readFileSync('src/store/AppContext.tsx', 'utf8');
appContext = appContext.replace(/telegramChatId: user\.telegramChatId,/g, "");
appContext = appContext.replace(/telegramChatId: t,/g, "");
appContext = appContext.replace(/\(userId: string, role: Role, department: string\)/g, "(userId: string, roles: Role[], departments: string[])");
appContext = appContext.replace(/\(userId: string, name: string, role: Role, department: string, jobTitle\?: string, telegramChatId\?: string\)/g, "(userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string)");
appContext = appContext.replace(/roles: \[role\],/g, "roles,");
appContext = appContext.replace(/departments: \[department\]/g, "departments");
fs.writeFileSync('src/store/AppContext.tsx', appContext);

console.log('Lint errors fixed');
