const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const botBlockPattern = `    let isInitialUsersLoad = true;`;
const botBlockReplacement = `
    // Admin Action Alerts
    let isInitialActivitiesLoad = true;
    onSnapshot(query(collection(clientDb, 'activity_logs')), (snapshot) => {
       if (isInitialActivitiesLoad) {
          isInitialActivitiesLoad = false;
          return;
       }
       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
             const data = change.doc.data();
             const userSnap = await getDoc(doc(clientDb, 'users', data.userId));
             const userName = userSnap.exists() ? userSnap.data().name : 'نەناسراو';
             const msg = \`📝 چالاکییەکی نوێ تۆمارکرا!\\n\\nئەندام: \${userName}\\nزانیاری: \${data.notes || 'بێ زانیاری'}\\nبڕ: \${data.quantity}\\nپێویستی بە پەسەندکردنە لەلایەن سەرپەرشتیارانەوە.\`;
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && (uData.roles || []).includes('Admin')) {
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });
    });

    let isInitialWorkflowLoad = true;
    onSnapshot(query(collection(clientDb, 'workflowTasks')), (snapshot) => {
       if (isInitialWorkflowLoad) {
          isInitialWorkflowLoad = false;
          return;
       }
       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' || change.type === 'modified') {
             const data = change.doc.data();
             const statusStr = data.status === 'Completed' ? 'تەواوکرا ✅' : (data.status === 'InProgress' ? 'لە جێبەجێکردندایە ⏳' : 'نوێ 🆕');
             const msg = \`📋 گۆڕانکاری لە ڕاسپاردەکان\\n\\nڕاسپاردە: \${data.title}\\nدۆخ: \${statusStr}\`;
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && (uData.roles || []).includes('Admin')) {
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });
    });

    let isInitialUsersLoad = true;`;

code = code.replace(botBlockPattern, botBlockReplacement);

fs.writeFileSync('server.ts', code);
