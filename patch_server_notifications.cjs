const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// We need to modify all onSnapshot listeners: public_comments, activity_logs, workflowTasks.

// For public_comments: currently notifies everyone. But we need to listen for 'modified' as well (replies) and customize the message based on the recipient's role.
const commentsPattern = `       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
             const data = change.doc.data();
             const authorSnap = await getDoc(doc(clientDb, 'users', data.userId));
             const authorName = authorSnap.exists() ? authorSnap.data().name : 'کەسێک';
             
             const msg = \`💬 پۆستێکی نوێ لە دیوەخان\\n\\nنێرەر: \${authorName}\\nبۆچوون: \${data.content || (data.poll ? 'ڕاپرسییەکی نوێی داناوە' : '')}\`;
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && uData.id !== data.userId) {
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });`;

const commentsReplacement = `       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' || change.type === 'modified') {
             const data = change.doc.data();
             
             // Simple hack to detect if it's a new comment or a reply
             const isReply = change.type === 'modified' && data.replies && data.replies.length > 0;
             // For simplicity, we just say "post or reply" if modified
             if (change.type === 'modified' && (!data.replies || data.replies.length === 0)) return; // Skip if just liked/voted
             
             const authorSnap = await getDoc(doc(clientDb, 'users', data.userId));
             const authorName = authorSnap.exists() ? authorSnap.data().name : 'کەسێک';
             
             const actionStr = isReply ? 'کۆمێنتێکی نوێ' : 'پۆستێکی نوێ';
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && uData.id !== data.userId) {
                     const isAdmin = (uData.roles || []).includes('Admin');
                     const msg = isAdmin 
                        ? \`🛡 سەرپەرشتیار ئاگاداربە\\n\${actionStr} لە دیوەخان لەلایەن [\${authorName}]\\nناوەڕۆک: \${data.content || (data.poll ? 'ڕاپرسی' : '')}\`
                        : \`💬 \${actionStr} لە دیوەخان\\nنێرەر: \${authorName}\\nبۆچوون: \${data.content || (data.poll ? 'ڕاپرسییەکی نوێی داناوە' : '')}\`;
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });`;
code = code.replace(commentsPattern, commentsReplacement);


// For activity_logs
const activitiesPattern = `       snapshot.docChanges().forEach(async (change) => {
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
       });`;

const activitiesReplacement = `       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
             const data = change.doc.data();
             const userSnap = await getDoc(doc(clientDb, 'users', data.userId));
             const userName = userSnap.exists() ? userSnap.data().name : 'نەناسراو';
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && uData.id !== data.userId) {
                     const isAdmin = (uData.roles || []).includes('Admin');
                     const msg = isAdmin
                        ? \`⚠️ [سەرپەرشتیار]\\n📝 چالاکییەکی نوێ تۆمارکرا لەلایەن \${userName}\\nزانیاری: \${data.notes || 'بێ زانیاری'}\\nپێویستی بە پەسەندکردنە.\`
                        : \`🌟 \${userName} چالاکییەکی نوێی تۆمارکرد!\\n(چاوەڕێی پەسەندکردنە)\`;
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });`;
code = code.replace(activitiesPattern, activitiesReplacement);

// For workflowTasks
const workflowPattern = `       snapshot.docChanges().forEach(async (change) => {
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
       });`;

const workflowReplacement = `       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' || change.type === 'modified') {
             const data = change.doc.data();
             const statusStr = data.status === 'Completed' ? 'تەواوکرا ✅' : (data.status === 'InProgress' ? 'لە جێبەجێکردندایە ⏳' : 'نوێ 🆕');
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId) {
                     const isAdmin = (uData.roles || []).includes('Admin');
                     const msg = isAdmin
                        ? \`📋 [ڕاسپاردە - سەرپەرشتیار]\\nڕاسپاردە: \${data.title}\\nدۆخ: \${statusStr}\`
                        : \`📋 گۆڕانکاری لە ڕاسپاردەکان\\nڕاسپاردە: \${data.title}\\nدۆخ: \${statusStr}\`;
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });`;
code = code.replace(workflowPattern, workflowReplacement);

fs.writeFileSync('server.ts', code);
