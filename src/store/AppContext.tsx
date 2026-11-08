import { arrayUnion } from 'firebase/firestore';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ActivityLog, DepartmentInfo, ActivityTask, Role, Notification, WorkflowTask, WorkflowHistoryItem, CustomBadge} from '../types';
import { BADGE_INFO, MILESTONES } from '../lib/badges';
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, doc, setDoc, getDoc, onSnapshot, query, addDoc, updateDoc, deleteDoc, orderBy 
} from 'firebase/firestore';

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../lib/firebase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  logs: ActivityLog[];
  departments: DepartmentInfo[];
  activities: ActivityTask[];
  customBadges: CustomBadge[];
  addCustomBadge: (badge: CustomBadge) => Promise<void>;
  updateCustomBadge: (badge: CustomBadge) => Promise<void>;
  deleteCustomBadge: (id: string) => Promise<void>;
  workflowTasks: WorkflowTask[];
  createWorkflowTask: (title: string, description: string, initialDepartmentId: string) => Promise<void>;
  forwardWorkflowTask: (taskId: string, nextDepartmentId: string, note?: string) => Promise<void>;
  completeWorkflowTask: (taskId: string, note?: string) => Promise<void>;
  notifications: Notification[];
  loading: boolean;
  aboutInfo: any;
  updateAboutInfo: (info: any) => Promise<void>;
  login: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
  addLog: (log: Omit<ActivityLog, 'id'>) => Promise<void>;
  updateLogStatus: (logId: string, status: ActivityLog['status']) => Promise<void>;
  deleteActivityLog: (logId: string) => Promise<void>;
  addDepartment: (dept: DepartmentInfo) => Promise<void>;
  updateDepartment: (dept: DepartmentInfo) => Promise<void>;
  addActivity: (activity: ActivityTask) => Promise<void>;
  updateActivity: (activity: ActivityTask) => Promise<void>;
  addUser: (email: string, pass: string, user: Omit<User, 'id'>) => Promise<void>;
  updateUserRole: (userId: string, roles: Role[], departments: string[]) => Promise<void>;
  updateProfile: (userId: string, data: Partial<User>) => Promise<void>;
  updateUserAdmin: (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string) => Promise<void>;
  deleteUserAdmin: (userId: string) => Promise<void>;
  updateUserPasswordAdmin: (userId: string, newPassword: string) => Promise<void>;
  awardBadge: (userId: string, badge: { type: string, dateAwarded: string, note?: string }) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  addNotification: (userId: string, message: string, type: string) => Promise<void>;
  viewProfileId: string | null;
  setViewProfileId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [departments, setDepartments] = useState<DepartmentInfo[]>([]);
  const [activities, setActivities] = useState<ActivityTask[]>([]);
  const [customBadges, setCustomBadges] = useState<CustomBadge[]>([]);
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);
  const [aboutInfo, setAboutInfo] = useState<any>(null);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Compute points dynamically based on approved logs
  const users = rawUsers.map(user => {
    const userLogs = logs.filter(l => l.userId === user.id && l.status === 'Approved');
    const totalPoints = userLogs.reduce((sum, log) => sum + log.totalPoints, 0);
    return { ...user, points: totalPoints };
  });
  
  // Also update currentUser with computed points
  const computedCurrentUser = currentUser ? users.find(u => u.id === currentUser.id) || currentUser : null;

  useEffect(() => {
    let unsubUsers: any;
    let unsubLogs: any;
    let unsubDepts: any;
    let unsubActs: any;
    let unsubBadges: any;
    let unsubWorkflowTasks: any;
    let unsubNotifs: any;

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data(); setCurrentUser({ id: user.uid, ...data, roles: data.roles || (data.role ? [data.role] : ['Member']), departments: data.departments || (data.department ? [data.department] : []) } as User);
        } else {
          // Fallback if not created properly
          setCurrentUser(null);
        }

        unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
          setRawUsers(snapshot.docs.map(d => {
            const data = d.data();
            return { id: d.id, ...data, roles: data.roles || (data.role ? [data.role] : ['Member']), departments: data.departments || (data.department ? [data.department] : []) } as User;
          }));
        });
        unsubLogs = onSnapshot(collection(db, 'activity_logs'), (snapshot) => {
          setLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLog)));
        });
        unsubDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
          setDepartments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as DepartmentInfo)));
        });
        unsubBadges = onSnapshot(collection(db, 'badges'), (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CustomBadge[];
          setCustomBadges(data);
        });
        unsubActs = onSnapshot(collection(db, 'activities'), (snapshot) => {
          setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityTask)));
        });
        unsubWorkflowTasks = onSnapshot(collection(db, 'workflowTasks'), (snapshot) => {
          setWorkflowTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WorkflowTask)));
        });
        unsubNotifs = onSnapshot(query(collection(db, 'notifications')), (snapshot) => {
          setNotifications(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Notification)));
          
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const notif = change.doc.data() as Notification;
              if (notif.userId === user.uid && !notif.read) {
                const notifTime = new Date(notif.date).getTime();
                const now = Date.now();
                // Only show for very recent notifications (within last 30 seconds)
                if (now - notifTime < 30000) {
                  if ('Notification' in window && window.Notification.permission === 'granted') {
                    new window.Notification('سایکۆفێر (Psychosphere)', {
                      body: notif.message,
                      icon: '/psychosphere-logo.png', // or standard icon
                      dir: 'rtl'
                    });
                  }
                }
              }
            }
          });
        });
      } else {
        setCurrentUser(null);
        setRawUsers([]);
        setLogs([]);
        setDepartments([]);
        setActivities([]);

        if (unsubUsers) unsubUsers();
        if (unsubLogs) unsubLogs();
        if (unsubDepts) unsubDepts();
        if (unsubActs) unsubActs();
          if (typeof unsubBadges === "function") unsubBadges();
      if (unsubWorkflowTasks) unsubWorkflowTasks();

        if (unsubNotifs) unsubNotifs();
      }
      setLoading(false);
    });


    // Fetch About Info
    const unsubscribeAbout = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (!data.content && data.projectDesc) {
          setAboutInfo({ content: `## ${data.projectTitle}\n\n${data.projectDesc}\n\n## ${data.targetTitle}\n\n${data.targetDesc}` });
        } else if (!data.content) {
          setAboutInfo({ content: "سایکۆفێر (بە ئینگلیزی: Psychofer)... تکایە دەقەکە نوێ بکەرەوە." });
        } else {
          setAboutInfo(data);
        }
      } else {
        setAboutInfo({ content: "سایکۆفێر (بە ئینگلیزی: Psychofer) پڕۆژەیەکی زانستی و دەروونیی سەربەخۆیە کە تایبەتە بە قوتابییان و پسپۆڕانی بەشە دەروونییەکان. ئەم پڕۆژەیە لە ١١ی کانوونی دووەمی ٢٠٢٢ دامەزراوە. لە گرنگترین خەسڵەتەکانی ئەم پڕۆژەیە ئەوەیە کە بۆ یەکەمین جار لە مێژووی بواری دەروونزانیی کوردیدا، بووەتە سەکۆیەک بۆ یەکخستن و کۆکردنەوەی پسپۆڕانی دەروونیی هەر چوار پارچەی کوردستان.[١] ئامانجی سەرەکیی پڕۆژەکە گەشەپێدانی تواناکانی قوتابییانی دەروونزانی و هاندانیانە بۆ پشتبەستن بە خود و بەرهەمهێنانی زانستی. دروشمی فەرمیی پڕۆژەکە بریتییە لە: «بەیەکەوە، بێئومێدی تێکدەشکێنین، بەیەکەوە ڕەگی زانست دەچێنین».[٢]\n\n### سەکۆی یەکگرتنی دەروونزانانی کوردستان\nیەکێک لە گرنگترین و مێژووییترین دەستکەوتەکانی پڕۆژەی سایکۆفێر ئەوەیە کە توانیویەتی سنوورە جوگرافییەکان تێپەڕێنێت و بۆ یەکەمین جار، پسپۆڕان و شارەزایانی بواری دەروونیی هەر چوار پارچەی کوردستان لەسەر یەک سەکۆی زانستی کۆ بکاتەوە.[٣] بەم هەنگاوە، سایکۆفێر بووەتە ناوەندێکی نەتەوەیی و ئەکادیمیی هاوبەش بۆ ئاڵوگۆڕی زانستی، یەکخستنی زاراوە دەروونییەکان و کارکردنی پێکەوەیی لە نێوان دەروونزانانی سەرانسەری کوردستان.\n\n### دیدگە و فەلسەفەی کارکردن\nدیدگەی سایکۆفێر لەسەر ئەو باوەڕە دامەزراوە کە خزمەتکردنی ڕاستەقینەی کۆمەڵگە، لە ڕێگەی خزمەتکردنی فێرخوازانەوە بەدی دێت.[٤] پڕۆژەکە پێی وایە ناتوانرێت گۆڕانکاری و خزمەت بە کۆمەڵگە بکرێت تاوەکوو سەرەتا تاکێکی بەرهەمدار دروست نەکرێت. لەبەر ئەم هۆکارە، سایکۆفێر بە شێوەیەکی پلەبەندی کار دەکات؛ لە هەنگاوی یەکەمدا سەرنج دەخاتە سەر فێرخوازان و بەتایبەت قوتابییان، دواتر کار لەسەر پسپۆڕانی بوارەکە دەکات، بۆ ئەوەی لە قۆناغی کۆتاییدا ئەو ژینگە زانستییە خزمەت بە سەرتاپای کۆمەڵگە بکات. ئەم ستراتیژییە بۆ ئەوەیە کە قوتابی بە شێوەیەکی دروست ئامادە بکرێت تا بچێتە ناو کۆمەڵگە و بە توانا و لێهاتووییەکانی، کەلێنەکانی کۆمەڵگە پڕ بکاتەوە.[٥]\n\n### مێژوو\nپڕۆژەی سایکۆفێر لە ١١ی کانوونی دووەمی ٢٠٢٢ لەلایەن کۆمەڵێک لە قوتابییانی بەشی دەروونزانیی زانکۆی سەڵاحەدین و زانکۆی سۆرانەوە دامەزرا.[٦][٧] لە سەرەتادا، چالاکییەکانی پڕۆژەکە تەنیا لە چوارچێوەی قوتابییانی ئەم دوو زانکۆیەدا بوو. دوای ساڵێک، پڕۆژەکە فراوان بوو و چەندین زانکۆ و بەشی دیکەی دەروونزانی بەشدارییان تێدا کرد، لەوانە بەشی پەروەردە و دەروونزانیی زانکۆی کۆیە[٨]، هەروەها بەشی ڕێنماییی پەروەردەیی و دەروونی لە کۆلێژی پەروەردەی زانکۆی سەڵاحەدین.[٩] و بەشی ڕێنمایی پەروەردەیی و دەروونیی کۆلێژی پەروەردەیی زانکۆی سلێمانی\n\n### پێکهاتە و ژینگەی کارکردن\nسەرجەم ئەندامانی پڕۆژەی سایکۆفێر پێکهاتوون لە خودی قوتابییان و پسپۆڕانی بواری دەروونزانی. سەرلەبەری ئەندامان کەسانی گەنجن کە بە تەواوی پشت بە توانا و لێهاتووییەکانی خۆیان دەبەستن.[١٠] ژینگەیەکی یارمەتیدەر و پاڵپشتیکاریان خولقاندووە کە هاندەری داهێنان و پێشکەوتنە. لە ڕووی کارگێڕییەوە، پڕۆژەکە دابەش بووە بەسەر چەندین دەستەی جیاوازدا، کە هەر دەستەیەک ئەرک و بەرپرسیارێتییەکی تایبەت بە کارەکانی پڕۆژەکە بەڕێوە دەبات.[١١]\n\nهەیکەلی کارگێڕیی پڕۆژەکە بەم شێوەیە دابەش بووە:\n\n*   **سەرپەرشتیاری گشتیی سایکۆفێر:** بەرپرسی داڕشتنی پلان و پەیڕەوی ناوخۆیی و سەرپەرشتیکردنی تەواوی کار و چالاکییەکانی پڕۆژەکەیە.\n*   **سەرپەرشتیاری بەشە دەروونییەکان:** چاودێری و سەرپەرشتیی چالاکی و کارە ناوخۆییەکانی بەشەکەی خۆی دەکات.\n*   **سەرپەرشتیاری دەستەکان:** بەرپرسیارێتیی بەڕێوەبردنی ئەو دەستەیەی لە ئەستۆیە کە پێی سپێردراوە.\n*   **یاریدەدەری سەرپەرشتیار:** جێگر و هاوکاری سەرپەرشتیاری دەستەکەیە و لە کاتی پێویستدا ئەرکەکان ڕادەپەڕێنێت.\n*   **ئەندامەکان:** ئەو کەسانەن کە لە یەک یان چەند دەستەیەکدا بەشدارن و ئەرکە دیاریکراوەکانیان جێبەجێ دەکەن.\n\n### بنەماکان\nسایکۆفێر لەسەر پێنج بنەمای سەرەکی کار دەکات:[٥]\n\n1.  **خودکارایی:** هاندانی فێرخوازان بۆ پشتبەستن بە تواناکانی خۆیان و هاوبەشیپێکردنیان لەگەڵ یەکتر.\n2.  **پڕکردنەوەی پێداویستییە زانستی و ئەکادیمییەکان:** بەکارهێنانی دەرئەنجامی خودکاراییی فێرخوازان بۆ پڕکردنەوەی کەلێنە ئەکادیمییەکان.\n3.  **پەرەدان بە ئەزموونی پیشەیی و زانستی:** یارمەتیدانی فێرخوازان بۆ گونجاندنی ئەزموونە کەسی و پیشەیییەکانیان لەگەڵ ئەزموونە زانستییەکەیان، تاوەکوو ئاراستەی پیشەیی و زانستییان هاوتەریب بێت.\n4.  **بەرزکردنەوەی ئاستی مەعریفی:** ڕەخساندنی کەشێکی زانستی کە هاندەر بێت بۆ بەرەوپێشبردنی ئاستی زانیاریی فێرخوازان بە شێوازێکی گونجاو بۆ کۆمەڵگە.\n5.  **قوتابیی بەرهەمهێن:** کۆکەرەوەی تەواوی قۆناغەکانی پێشووە، بۆ ئەوەی فێرخواز ببێتە کەسێکی بەرهەمدار و سوودبەخش.\n\n### بەرهەم و چالاکییەکان\nسایکۆفێر کار و چالاکییەکانی لە چەندین بواری جیاوازدا چڕ کردووەتەوە، کە گرنگترینیان بریتین لە:\n\n*   **گۆڤاری سایکۆفێر:** یەکێک لە دیارترین بەرهەمەکانی پڕۆژەکەیە. لە ئێستادا، ئەم گۆڤارە تاکە گۆڤاری تایبەتمەندە بە بواری دەروونزانی کە بە زمانی کوردی سۆرانی بەردەست بێت و بە شێوەیەکی زانستی بڵاو بکرێتەوە.[٥][١٢][١٣]\n*   **پێشبڕکێی ساڵانەی سایکۆفێر:** وەک دەستپێشخەرییەکی نوێی زانستی، پڕۆژەکە بۆ یەکەمین جار پێشبڕکێیەکی ساڵانەی لە نێوان بەشە دەروونییەکانی هەر سێ زانکۆی (سەڵاحەدین، سۆران، و کۆیە) ئەنجام داوە.[١٤]\n*   **وەرگێڕان و بڵاوکراوەی چاپکراو:** وەرگێڕانی سەرچاوە زانستییەکان و ئامادەکردنی بڵاوکراوەی تایبەت.\n*   **کاری مەیدانی و وێبینار:** ئەنجامدانی خول، دەرسوتار (وێبینار)، و چالاکیی مەیدانی کە سوود بە قوتابییانی بەشە دەروونییەکان دەگەیەنن.\n" });
      }
    });

  
  const updateAboutInfo = async (info: any) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), info);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  return () => {
      unsubscribeAbout();
      unsubAuth();
      if (unsubUsers) unsubUsers();
      if (unsubLogs) unsubLogs();
      if (unsubDepts) unsubDepts();
      if (unsubActs) unsubActs();

      if (unsubNotifs) unsubNotifs();
    };
  }, []);

    const updateAboutInfo = async (info: any) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), info);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };

  const login = async (e: string, p: string) => {
    const cred = await signInWithEmailAndPassword(auth, e, p);
    const admins = users.filter(u => u.roles && (u.roles || []).includes('Admin'));
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    const uName = userDoc.exists() ? userDoc.data().name : cred.user.email;
    for (const admin of admins) {
      if (admin.id !== cred.user.uid) {
        addNotification(admin.id, `بەکارهێنەر ${uName} هاتە ژوورەوە.`, 'login_alert').catch(console.error);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

    const addLog = async (logData: Omit<ActivityLog, 'id'>) => {
    await addDoc(collection(db, 'activity_logs'), logData);
    const admins = users.filter(u => u.roles && (u.roles || []).includes('Admin'));
    for (const admin of admins) {
      addNotification(admin.id, `چالاکییەکی نوێ تۆمارکرا و پێویستی بە پەسەندکردنە.`, 'new_activity').catch(console.error);
      if (admin.email) {
        console.log(`[Email Simulation] Sending email to ${admin.email}: New activity recorded.`);
      }
    }
  };

  const updateLogStatus = async (logId: string, status: ActivityLog['status']) => {
    await updateDoc(doc(db, 'activity_logs', logId), { status });
    const log = logs.find(l => l.id === logId);
    if (log) {
      let msg = '';
      if (status === 'Approved') msg = 'یەکێک لە چالاکییەکانت پەسەندکرا!';
      if (status === 'Rejected') msg = 'یەکێک لە چالاکییەکانت ڕەتکرایەوە.';
      if (msg) {
        await addNotification(log.userId, msg, 'activity_status');
      }
    }
  };

  const deleteActivityLog = async (logId: string) => {
    const logToDelete = logs.find(l => l.id === logId);
    if (!logToDelete) return;

    if (!currentUser || !currentUser.roles.includes('Admin')) {
      throw new Error('تەنها سەرپەرشتیاری گشتی دەتوانێت چالاکی بسڕێتەوە.');
    }

    const task = activities.find(a => a.id === logToDelete.taskId);
    const actTitle = task?.name || logToDelete.notes || 'چالاکی';
    const pointsDeducted = logToDelete.totalPoints || 0;

    await deleteDoc(doc(db, 'activity_logs', logId));

    if (logToDelete.userId) {
      await addNotification(
        logToDelete.userId,
        `چالاکیی "${actTitle}" (${pointsDeducted} خاڵ) لەلایەن سەرپەرشتیاری گشتییەوە سڕایەوە بەهۆی تۆماری دووبارە، و خاڵەکان کەمکرانەوە.`,
        'activity_deleted'
      ).catch(console.error);
    }
  };

  const addDepartment = async (dept: DepartmentInfo) => {
    await setDoc(doc(db, 'departments', dept.id), dept);
  };

  const updateDepartment = async (dept: DepartmentInfo) => {
    await updateDoc(doc(db, 'departments', dept.id), { ...dept });
  };

  
  const addCustomBadge = async (badge: CustomBadge) => {
    if (!currentUser || !currentUser.roles.includes('Admin')) return;
    await setDoc(doc(db, 'badges', badge.id), badge);
  };
  const updateCustomBadge = async (badge: CustomBadge) => {
    if (!currentUser || !currentUser.roles.includes('Admin')) return;
    await setDoc(doc(db, 'badges', badge.id), badge);
  };
  const deleteCustomBadge = async (id: string) => {
    if (!currentUser || !currentUser.roles.includes('Admin')) return;
    await deleteDoc(doc(db, 'badges', id));
  };

  const addActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
    
    // Notify users in that department
    const deptUsers = rawUsers.filter(u => u.departments.includes(activity.department));
    for (const u of deptUsers) {
      if (u.id !== currentUser?.id) {
        addNotification(u.id, `چالاکییەکی نوێ بەناوی "${activity.name}" بۆ بەشەکەت زیادکرا.`, 'new_task').catch(console.error);
      }
    }
  };

  const updateActivity = async (activity: ActivityTask) => {
    await setDoc(doc(db, 'activities', activity.id), activity);
    // Notify users in that department
    const deptUsers = rawUsers.filter(u => u.departments.includes(activity.department));
    for (const u of deptUsers) {
      if (u.id !== currentUser?.id) {
        addNotification(u.id, `زانیاری چالاکی "${activity.name}" نوێکرایەوە.`, 'task_updated').catch(console.error);
      }
    }
  };

  const addUser = async (email: string, pass: string, userData: Omit<User, 'id'>) => {
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
    const { getAuth, createUserWithEmailAndPassword, signOut } = await import('firebase/auth');
    const secondaryAuth = getAuth(secondaryApp);
    
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: userData.name,
        roles: userData.roles || ["Member"],
        departments: userData.departments || [],
        jobTitle: userData.jobTitle || '',
        email: email,
        points: 0
      });
      await signOut(secondaryAuth);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const updateUserRole = async (userId: string, roles: Role[], departments: string[]) => {
    await updateDoc(doc(db, 'users', userId), { roles, departments });
    if (currentUser && currentUser.id !== userId) {
      await addNotification(userId, 'پۆستەکەت یان بەشەکەت لەلایەن سەرپەرشتیارەوە گۆڕدرا.', 'role_updated');
    }
  };

  const updateProfile = async (userId: string, data: Partial<User>) => {
    await updateDoc(doc(db, "users", userId), data);
  };

  const updateUserAdmin = async (userId: string, name: string, roles: Role[], departments: string[], jobTitle?: string) => {
    await updateDoc(doc(db, 'users', userId), { name, roles, departments, jobTitle: jobTitle || '' });
    if (currentUser && currentUser.id !== userId) {
      await addNotification(userId, 'زانیارییەکانی هەژمارەکەت گۆڕدرا لەلایەن بەڕێوەبەرەوە.', 'admin_update');
    }
  };

  const deleteUserAdmin = async (userId: string) => {
    // Delete the user from Firestore. Without Admin SDK, we can't delete them from Auth, 
    // but deleting their doc effectively removes them from the system.
    await deleteDoc(doc(db, 'users', userId));
  };

  const updateUserPasswordAdmin = async (userId: string, newPassword: string) => {
    throw new Error('گۆڕینی وشەی نهێنی بۆ ئەندامەکانی تر لەم وەشانەدا بەردەست نییە بەهۆی پاراستنی ئاسایشەوە.');
  };


  const createWorkflowTask = async (title: string, description: string, initialDepartmentId: string) => {
    if (!currentUser) return;
    const newTask: Omit<WorkflowTask, 'id'> = {
      title,
      description,
      createdBy: currentUser.id,
      currentDepartmentId: initialDepartmentId,
      status: 'active',
      history: [{
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        action: 'created',
        toDepartmentId: initialDepartmentId,
        byUserId: currentUser.id,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'workflowTasks'), newTask);
    
    const message = `ڕاسپاردەیەکی نوێ: "${title}" ئاراستەی بەشەکەت کرا.`;
    const targetUsers = rawUsers.filter(u => u.departments?.includes(initialDepartmentId));
    for (const u of targetUsers) {
      if (u.id !== currentUser.id) {
        addNotification(u.id, message, 'workflow_created').catch(console.error);
      }
    }
  };

  const forwardWorkflowTask = async (taskId: string, nextDepartmentId: string, note?: string) => {
    if (!currentUser) return;
    const task = workflowTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const historyItem: WorkflowHistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      action: 'forwarded',
      fromDepartmentId: task.currentDepartmentId,
      toDepartmentId: nextDepartmentId,
      byUserId: currentUser.id,
      timestamp: new Date().toISOString(),
      note
    };
    
    await updateDoc(doc(db, 'workflowTasks', taskId), {
      currentDepartmentId: nextDepartmentId,
      history: arrayUnion(historyItem)
    });
    
    const message = `ڕاسپاردەی "${task.title}" ئاراستەی بەشەکەت کرا.`;
    const targetUsers = rawUsers.filter(u => u.departments?.includes(nextDepartmentId));
    for (const u of targetUsers) {
      if (u.id !== currentUser.id) {
        addNotification(u.id, message, 'workflow_forwarded').catch(console.error);
      }
    }
  };

  const completeWorkflowTask = async (taskId: string, note?: string) => {
    if (!currentUser) return;
    const task = workflowTasks.find(t => t.id === taskId);
    if (!task) return;
    
    const historyItem: WorkflowHistoryItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      action: 'completed',
      fromDepartmentId: task.currentDepartmentId,
      byUserId: currentUser.id,
      timestamp: new Date().toISOString(),
      note
    };
    
    await updateDoc(doc(db, 'workflowTasks', taskId), {
      status: 'completed',
      history: arrayUnion(historyItem)
    });
    
    if (task.createdBy !== currentUser.id) {
      addNotification(task.createdBy, `ڕاسپاردەی "${task.title}" تەواوکرا!`, 'workflow_completed').catch(console.error);
    }
  };

  const markNotificationRead = async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  };

  const addNotification = async (userId: string, message: string, type: string) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message,
      date: new Date().toISOString(),
      read: false,
      type
    });
    
    try {
      // Find the user to get their telegramChatId
      const targetUser = users.find(u => u.id === userId);
      if (targetUser?.socials?.telegramChatId) {
        await fetch('/api/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: targetUser.socials?.telegramChatId, message })
        });
      }
    } catch (err) {
      console.error('Failed to send telegram notification:', err);
    }
  };

  const awardBadge = async (userId: string, badge: { type: string, dateAwarded: string, note?: string }) => {
    const user = rawUsers.find(u => u.id === userId);
    if (!user) return;
    const currentBadges = user.badges || [];
    // prevent duplicate milestone badges
    if (badge.type.startsWith('milestone_') && currentBadges.some(b => b.type === badge.type)) {
       return;
    }
    await updateDoc(doc(db, 'users', userId), {
      badges: [...currentBadges, badge]
    });
    const bInfo = BADGE_INFO[badge.type];
    const bTitle = bInfo?.label || 'باجێکی نوێ';
    addNotification(userId, `پیرۆزە! نیشانەی «${bTitle}»ت پێبەخشرا.`, 'new_badge').catch(console.error);
  };

  // Auto-award milestone badges when user points reach thresholds
  useEffect(() => {
    if (!rawUsers || rawUsers.length === 0 || !logs) return;

    users.forEach(async (u) => {
      const uPoints = u.points || 0;
      if (uPoints < 50) return;

      const currentBadges = u.badges || [];
      const newBadges: { type: string; dateAwarded: string; note?: string }[] = [];

      for (const m of MILESTONES) {
        if (uPoints >= m.threshold && !currentBadges.some(b => b.type === m.id)) {
          newBadges.push({
            type: m.id,
            dateAwarded: new Date().toLocaleDateString('ku-IQ'),
            note: `گەیشتن بە ئامانجی ${m.label}`
          });
        }
      }

      if (newBadges.length > 0) {
        try {
          await updateDoc(doc(db, 'users', u.id), {
            badges: [...currentBadges, ...newBadges]
          });
          for (const nb of newBadges) {
            const bInfo = BADGE_INFO[nb.type];
            const title = bInfo?.label || nb.type;
            await addNotification(
              u.id,
              `پیرۆزە! بەهۆی گەیشتن بە ${title} لە چالاکییەکانتدا، نیشانەی «${title}»ت بەدەستهێنا! 🎉`,
              'new_badge'
            );
          }
        } catch (err) {
          console.error('Error auto-awarding milestone badge:', err);
        }
      }
    });
  }, [logs, rawUsers]);

  useEffect(() => {
    if ('Notification' in window && window.Notification.permission !== 'granted' && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission();
    }
  }, []);
  return (
    <AppContext.Provider value={{
      currentUser: computedCurrentUser, users, logs, departments, activities, customBadges, addCustomBadge, updateCustomBadge, deleteCustomBadge, workflowTasks, notifications, loading,
      aboutInfo, updateAboutInfo,
      createWorkflowTask, forwardWorkflowTask, completeWorkflowTask,
      login, logout, addLog, viewProfileId, setViewProfileId, updateLogStatus, deleteActivityLog, addDepartment, updateDepartment, addActivity, updateActivity, addUser, updateUserRole, updateProfile, updateUserAdmin, deleteUserAdmin, updateUserPasswordAdmin, awardBadge, markNotificationRead, addNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
