const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

code = code.replace(
  /const deleteUserAdmin = async \([^)]+\) => {[\s\S]*?};\n/,
  `const deleteUserAdmin = async (userId: string) => {
    // Delete the user from Firestore. Without Admin SDK, we can't delete them from Auth, 
    // but deleting their doc effectively removes them from the system.
    await deleteDoc(doc(db, 'users', userId));
  };\n`
);

code = code.replace(
  /const updateUserPasswordAdmin = async \([^)]+\) => {[\s\S]*?};\n/,
  `const updateUserPasswordAdmin = async (userId: string, newPassword: string) => {
    throw new Error('گۆڕینی وشەی نهێنی بۆ ئەندامەکانی تر لەم وەشانەدا بەردەست نییە بەهۆی پاراستنی ئاسایشەوە.');
  };\n`
);

fs.writeFileSync('src/store/AppContext.tsx', code);
