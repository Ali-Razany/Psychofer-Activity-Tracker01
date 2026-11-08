const fs = require('fs');

let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

// add arrayUnion
code = code.replace(/updateDoc, deleteDoc, orderBy } from 'firebase\/firestore';/, "updateDoc, deleteDoc, orderBy, arrayUnion } from 'firebase/firestore';");

// fix telegramChatId
code = code.replace(/telegramChatId: t,/g, "");
code = code.replace(/telegramChatId: user\.telegramChatId,/g, "");

// add aboutInfo and updateAboutInfo to the provider
code = code.replace(
  /loading,\n      createWorkflowTask, forwardWorkflowTask, completeWorkflowTask,/,
  "loading,\n      aboutInfo, updateAboutInfo,\n      createWorkflowTask, forwardWorkflowTask, completeWorkflowTask,"
);

fs.writeFileSync('src/store/AppContext.tsx', code);
console.log('Fixed AppContext.tsx');
