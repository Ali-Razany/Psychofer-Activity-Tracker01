const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add new imports for Firestore
const importPattern = `import { getFirestore as getClientFirestore, doc, setDoc } from "firebase/firestore";`;
const importReplacement = `import { getFirestore as getClientFirestore, doc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";`;
code = code.replace(importPattern, importReplacement);

// Add logic to bot block
const botBlockPattern = `    bot.onText(/\\/start/, async (msg: any) => {`;

const botBlockReplacement = `    async function getLinkedUser(chatId: number) {
      const q = query(collection(clientDb, 'users'), where('socials.telegramChatId', '==', String(chatId)));
      const snap = await getDocs(q);
      if (!snap.empty) {
         return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
      return null;
    }

    // 1. Add Activity Command
    bot.onText(/\\/add_activity(?: (.+))?/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      const notes = match[1] ? match[1].trim() : '';
      
      if (!notes) {
         bot?.sendMessage(chatId, "تکایە وردەکاری چالاکییەکە بنووسە. بۆ نموونە:\\n/add_activity خوێندنەوەی کتێب ٥ پەڕە");
         return;
      }
      
      const user = await getLinkedUser(chatId);
      if (!user) {
         bot?.sendMessage(chatId, "پروفایلەکەت نەبەستراوەتەوە بە تێلیگرام. تکایە سەرەتا لە ئەپەکە یوزەرنەیمەکەت بنووسە و پشتڕاستی بکەرەوە.");
         return;
      }
      
      const actSnap = await getDocs(collection(clientDb, 'activities'));
      let taskId = 'telegram_task';
      if (!actSnap.empty) taskId = actSnap.docs[0].id;
      
      await addDoc(collection(clientDb, 'activity_logs'), {
         userId: user.id,
         taskId: taskId,
         quantity: 1,
         qualityModifier: 1,
         totalPoints: 10,
         date: new Date().toISOString().split('T')[0],
         notes: notes,
         status: 'Pending'
      });
      
      bot?.sendMessage(chatId, "✅ چالاکییەکەت بە سەرکەوتوویی نێردرا بۆ پەسەندکردن!");
    });

    // 3. Polls Command
    bot.onText(/\\/polls/, async (msg: any) => {
       const chatId = msg.chat.id;
       const user = await getLinkedUser(chatId);
       if (!user) {
          bot?.sendMessage(chatId, "پروفایلەکەت نەبەستراوەتەوە بە تێلیگرام.");
          return;
       }
       
       const q = query(collection(clientDb, 'public_comments'));
       const snap = await getDocs(q);
       let pollsFound = 0;
       
       for (const document of snap.docs) {
          const data = document.data();
          if (data.poll) {
             pollsFound++;
             const inline_keyboard = data.poll.options.map((opt: any) => {
                return [{ text: opt.text, callback_data: \`vote_\${document.id}_\${opt.id}\` }];
             });
             
             bot?.sendMessage(chatId, \`📊 ڕاپرسی:\\n\${data.poll.question}\`, {
                reply_markup: { inline_keyboard }
             });
          }
       }
       
       if (pollsFound === 0) {
          bot?.sendMessage(chatId, "هیچ ڕاپرسییەک بەردەست نییە لە ئێستادا.");
       }
    });

    bot.on('callback_query', async (queryObj: any) => {
       const chatId = queryObj.message.chat.id;
       const data = queryObj.data;
       
       if (data && data.startsWith('vote_')) {
          const parts = data.split('_'); 
          const commentId = parts[1];
          const optionId = parts.slice(2).join('_');
          
          const user = await getLinkedUser(chatId);
          if (!user) {
             bot?.answerCallbackQuery(queryObj.id, { text: 'تکایە سەرەتا هەژمارەکەت ببەستەوە.' });
             return;
          }
          
          const commentRef = doc(clientDb, 'public_comments', commentId);
          const commentSnap = await getDoc(commentRef);
          if (commentSnap.exists()) {
             const commentData = commentSnap.data();
             if (commentData.poll) {
                 const newOptions = commentData.poll.options.map((opt: any) => {
                    let votes = (opt.votes || []).filter((id: string) => id !== user.id);
                    if (opt.id === optionId) {
                       votes.push(user.id);
                    }
                    return { ...opt, votes };
                 });
                 
                 await updateDoc(commentRef, { 'poll.options': newOptions });
                 bot?.answerCallbackQuery(queryObj.id, { text: 'دەنگەکەت تۆمارکرا!' });
             }
          }
       }
    });

    // 2. Normal text messages -> Public Chat
    bot.on('message', async (msg: any) => {
       const chatId = msg.chat.id;
       const text = msg.text;
       
       if (!text || text.startsWith('/')) return;
       
       const user = await getLinkedUser(chatId);
       if (!user) {
          bot?.sendMessage(chatId, "تکایە سەرەتا /start بنێرە و هەژمارەکەت ببەستەوە.");
          return;
       }
       
       await addDoc(collection(clientDb, 'public_comments'), {
          userId: user.id,
          content: text.trim(),
          timestamp: new Date().toISOString()
       });
       
       bot?.sendMessage(chatId, "✅ پۆستەکەت لە دیوەخانی گشتی بڵاوکرایەوە!");
    });

    // 4. Notifications (Server-side listeners)
    let isInitialCommentsLoad = true;
    onSnapshot(query(collection(clientDb, 'public_comments')), (snapshot) => {
       if (isInitialCommentsLoad) {
          isInitialCommentsLoad = false;
          return;
       }
       snapshot.docChanges().forEach(async (change) => {
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
       });
    });

    let isInitialUsersLoad = true;
    onSnapshot(query(collection(clientDb, 'users')), (snapshot) => {
       if (isInitialUsersLoad) {
          isInitialUsersLoad = false;
          return;
       }
       snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
             const data = change.doc.data();
             const msg = \`🎉 ئەندامێکی نوێ پەیوەندی پێوەکردین!\\n\\nبەخێربێیت \${data.name} 👏\`;
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && uData.id !== data.id) {
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });
    });

    bot.onText(/\\/start/, async (msg: any) => {`;

code = code.replace(botBlockPattern, botBlockReplacement);

fs.writeFileSync('server.ts', code);
