import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as admin from "firebase-admin";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { initializeApp as initClientApp } from "firebase/app";
import { getFirestore as getClientFirestore, doc, setDoc, collection, query, where, getDocs, addDoc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";


admin.initializeApp();
const adminDb = getAdminFirestore();
const adminAuth = getAdminAuth();

const firebaseConfig = {
  apiKey: "AIzaSyCEyXZf5O6-EP8FngA2C3Mo4nuuyNLrhj0",
  authDomain: "gen-lang-client-0405210695.firebaseapp.com",
  projectId: "gen-lang-client-0405210695",
  storageBucket: "gen-lang-client-0405210695.firebasestorage.app",
  messagingSenderId: "627280206572",
  appId: "1:627280206572:web:a3bba1d668907b183ce3c9"
};

const clientApp = initClientApp(firebaseConfig, "client-app");
const clientDb = getClientFirestore(clientApp, "ai-studio-psychosphereacti-e7cfecbb-6f34-4c8c-94e9-95607da26b15");

let bot: any = null;

async function startServer() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (token) {
    // Suppress node-telegram-bot-api deprecation warning for deleteWebHook
    process.env.NTBA_FIX_319 = '1';
    
    const mod = await import('node-telegram-bot-api');
    const TelegramBot: any = mod.default || mod;
    bot = new TelegramBot(token, { polling: { params: { timeout: 10 } } });

    const APP_URL = 'https://ais-pre-gfh6pypphpzjzu2bgyjyt6-99662122482.europe-west2.run.app';
    const originalSendMessage = bot.sendMessage.bind(bot);
    bot.sendMessage = async (chatId: any, text: string, options?: any) => {
      const linkText = `\n\n🔗 لینکی سیستەم:\n${APP_URL}`;
      return originalSendMessage(chatId, text + linkText, options);
    };

    process.once('SIGINT', () => { bot?.stopPolling(); process.exit(0); });
    process.once('SIGTERM', () => { bot?.stopPolling(); process.exit(0); });
    
    bot.on('polling_error', (error: any) => {
      if (error.code === 'ETELEGRAM' && error.message.includes('409')) {
        // Silently handle conflict by stopping polling
      } else {
        console.error('Telegram polling error:', error.message);
      }
      if (error.code === 'ETELEGRAM' && (error.message.includes('404') || error.message.includes('401') || error.message.includes('409'))) {
        if (!error.message.includes('409')) {
          console.warn('Invalid Telegram token, stopping polling.');
        }
        bot.stopPolling();
      }
    });
    
    async function getLinkedUser(chatId: number) {
      const q = query(collection(clientDb, 'users'), where('socials.telegramChatId', '==', String(chatId)));
      const snap = await getDocs(q);
      if (!snap.empty) {
         return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
      return null;
    }

    // 1. Add Activity Command
    bot.onText(/\/add_activity(?: (.+))?/, async (msg: any, match: any) => {
      const chatId = msg.chat.id;
      const notes = match[1] ? match[1].trim() : '';
      
      if (!notes) {
         bot?.sendMessage(chatId, "تکایە وردەکاری چالاکییەکە بنووسە. بۆ نموونە:\n/add_activity خوێندنەوەی کتێب ٥ پەڕە");
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
    bot.onText(/\/polls/, async (msg: any) => {
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
                return [{ text: opt.text, callback_data: `vote_${document.id}_${opt.id}` }];
             });
             
             bot?.sendMessage(chatId, `📊 ڕاپرسی:\n${data.poll.question}`, {
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
                        ? `🛡 سەرپەرشتیار ئاگاداربە\n${actionStr} لە دیوەخان لەلایەن [${authorName}]\nناوەڕۆک: ${data.content || (data.poll ? 'ڕاپرسی' : '')}`
                        : `💬 ${actionStr} لە دیوەخان\nنێرەر: ${authorName}\nبۆچوون: ${data.content || (data.poll ? 'ڕاپرسییەکی نوێی داناوە' : '')}`;
                     bot?.sendMessage(uData.socials.telegramChatId, msg).catch(() => {});
                 }
             });
          }
       });
    });


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
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId && uData.id !== data.userId) {
                     const isAdmin = (uData.roles || []).includes('Admin');
                     const msg = isAdmin
                        ? `⚠️ [سەرپەرشتیار]\n📝 چالاکییەکی نوێ تۆمارکرا لەلایەن ${userName}\nزانیاری: ${data.notes || 'بێ زانیاری'}\nپێویستی بە پەسەندکردنە.`
                        : `🌟 ${userName} چالاکییەکی نوێی تۆمارکرد!\n(چاوەڕێی پەسەندکردنە)`;
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
             
             const usersSnap = await getDocs(collection(clientDb, 'users'));
             usersSnap.forEach(userDoc => {
                 const uData = userDoc.data();
                 if (uData.socials?.telegramChatId) {
                     const isAdmin = (uData.roles || []).includes('Admin');
                     const msg = isAdmin
                        ? `📋 [ڕاسپاردە - سەرپەرشتیار]\nڕاسپاردە: ${data.title}\nدۆخ: ${statusStr}`
                        : `📋 گۆڕانکاری لە ڕاسپاردەکان\nڕاسپاردە: ${data.title}\nدۆخ: ${statusStr}`;
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
             const msg = `🎉 ئەندامێکی نوێ پەیوەندی پێوەکردین!\n\nبەخێربێیت ${data.name} 👏`;
             
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

    bot.onText(/\/start/, async (msg: any) => {
      const chatId = msg.chat.id;
      let username = msg.from?.username;
      
      if (username) {
        try {
          username = username.replace('@', '');
          await setDoc(doc(clientDb, 'telegram_links', username.toLowerCase()), {
            chatId: chatId.toString(),
            timestamp: Date.now()
          });
          bot?.sendMessage(chatId, `بەخێربێیت! ئەگەر یوزەرنەیمەکەت لە ئەپەکە نووسیبێت، ئێستا دەتوانیت دوگمەی 'پشتڕاستکردنەوە' دابگریت.`);
        } catch (err) {
          console.error('Error linking telegram:', err);
        }
      } else {
        bot?.sendMessage(chatId, 'تکایە یوزەرنەیمی تێلیگرام بۆ هەژمارەکەت دابنێ پێش ئەوەی بەکاری بهێنیت.');
      }
    });
  }

  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Instagram Webhook Verification
  app.get("/api/webhooks/instagram", (req, res) => {
    const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || "saikofear_token";
    
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  });

  // Instagram Webhook Event Receiving
  app.post("/api/webhooks/instagram", async (req, res) => {
    try {
      const body = req.body;
      console.log("Received Instagram webhook:", JSON.stringify(body, null, 2));

      // Check if it's from an Instagram page
      if (body.object === "instagram" || body.object === "page") {
        let postData: any = null;
        
        // Extract useful data if possible
        if (body.entry && body.entry.length > 0) {
          const entry = body.entry[0];
          if (entry.changes && entry.changes.length > 0) {
            const change = entry.changes[0];
            postData = {
              mediaId: change.value?.media_id || change.value?.id || `sim_${Date.now()}`,
              permalink: change.value?.permalink || "https://instagram.com/saikofear",
              mediaUrl: change.value?.media_url || "",
              caption: change.value?.text || change.value?.caption || "بڵاوکراوەی نوێ لە ئینستاگرام",
              timestamp: new Date().toISOString(),
              claimedBy: []
            };
          }
        }
        
        if (!postData) {
          // Fallback if structure is unexpected
          postData = {
            mediaId: `hook_${Date.now()}`,
            permalink: "https://instagram.com/saikofear",
            mediaUrl: "",
            caption: "بڵاوکراوەی نوێ لە ئینستاگرام",
            timestamp: new Date().toISOString(),
            claimedBy: [],
            rawPayload: body
          };
        }

        const docRef = doc(clientDb, 'instagram_posts', String(postData.mediaId));
        await setDoc(docRef, postData);
      }
      
      res.status(200).send("EVENT_RECEIVED");
    } catch (error: any) {
      console.error("Error processing Instagram webhook:", error);
      res.status(500).send(error.toString());
    }
  });

  // Make.com / Zapier Webhook for Instagram
  app.post("/api/webhooks/custom-instagram", async (req, res) => {
    try {
      const body = req.body;
      console.log("Received custom Instagram webhook (Make/Zapier):", JSON.stringify(body, null, 2));

      const { permalink, mediaUrl, caption, secret } = body;
      
      // Optional: Check a secret token to prevent unauthorized access
      const EXPECTED_SECRET = process.env.MAKE_WEBHOOK_SECRET || "psychosphere_secret";
      if (secret && secret !== EXPECTED_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!permalink) {
        return res.status(400).json({ error: "Missing permalink" });
      }

      const mediaId = `make_${Date.now()}`;
      const postData = {
        mediaId,
        permalink,
        mediaUrl: mediaUrl || "",
        caption: caption || "بڵاوکراوەی نوێ لە ئینستاگرام",
        timestamp: new Date().toISOString(),
        claimedBy: []
      };

      const docRef = doc(clientDb, 'instagram_posts', mediaId);
      await setDoc(docRef, postData);

      res.status(200).json({ success: true, message: "Post added successfully", mediaId });
    } catch (error: any) {
      console.error("Error processing custom Instagram webhook:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // Delete user from Firebase Auth
  app.delete("/api/users/:uid", async (req, res) => {
    try {
      const uid = req.params.uid;
      const adminUid = req.headers["x-admin-uid"] as string;
      if (!adminUid) return res.status(401).json({ error: "Unauthorized" });
      
      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      const adminData = adminDoc.data();
      if (!adminDoc.exists || !(adminData?.roles || []).includes("Admin")) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      await adminAuth.deleteUser(uid);
      await adminDb.collection("users").doc(uid).delete();
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Update user password
  app.patch("/api/users/:uid/password", async (req, res) => {
    try {
      const uid = req.params.uid;
      const adminUid = req.headers["x-admin-uid"] as string;
      const { password } = req.body;
      
      if (!adminUid) return res.status(401).json({ error: "Unauthorized" });
      if (!password || password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
      
      const adminDoc = await adminDb.collection("users").doc(adminUid).get();
      const adminData = adminDoc.data();
      if (!adminDoc.exists || !(adminData?.roles || []).includes("Admin")) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      await adminAuth.updateUser(uid, { password });
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error updating user password:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Telegram notification endpoint
  app.post("/api/telegram/notify", async (req, res) => {
    try {
      const { chatId, message } = req.body;
      if (!chatId || !message) return res.status(400).json({ error: "Missing parameters" });
      
      if (bot) {
        try {
          await bot.sendMessage(chatId, message);
          return res.json({ success: true, sent: true });
        } catch (botError: any) {
          console.error("Error sending telegram notification:", botError.message);
          return res.status(200).json({ success: false, sent: false, error: botError.message });
        }
      }
      return res.json({ success: true, sent: false, reason: "No bot token" });
    } catch (error: any) {
      console.error("Error sending telegram notification:", error);
      res.status(500).json({ error: error.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
