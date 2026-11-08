const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

const importRegex = /import \{([^}]+)\} from '\.\.\/types';/;
code = code.replace(importRegex, (match, p1) => {
  return `import {${p1}, WorkflowTask, WorkflowHistoryItem} from '../types';`;
});

const interfaceTarget = `  activities: ActivityTask[];`;
const interfaceReplacement = `  activities: ActivityTask[];
  workflowTasks: WorkflowTask[];
  createWorkflowTask: (title: string, description: string, initialDepartmentId: string) => Promise<void>;
  forwardWorkflowTask: (taskId: string, nextDepartmentId: string, note?: string) => Promise<void>;
  completeWorkflowTask: (taskId: string, note?: string) => Promise<void>;`;

code = code.replace(interfaceTarget, interfaceReplacement);

const stateTarget = `  const [activities, setActivities] = useState<ActivityTask[]>([]);`;
const stateReplacement = `  const [activities, setActivities] = useState<ActivityTask[]>([]);
  const [workflowTasks, setWorkflowTasks] = useState<WorkflowTask[]>([]);`;

code = code.replace(stateTarget, stateReplacement);

const snapshotTarget = `    const unsubscribeActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityTask)));
    });`;
const snapshotReplacement = `    const unsubscribeActivities = onSnapshot(collection(db, 'activities'), (snapshot) => {
      setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityTask)));
    });

    const unsubscribeWorkflowTasks = onSnapshot(collection(db, 'workflowTasks'), (snapshot) => {
      setWorkflowTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WorkflowTask)));
    });`;

code = code.replace(snapshotTarget, snapshotReplacement);

const methodsTarget = `  const markNotificationRead = async (id: string) => {`;
const methodsReplacement = `
  const createWorkflowTask = async (title: string, description: string, initialDepartmentId: string) => {
    if (!currentUser) return;
    const newTask: Omit<WorkflowTask, 'id'> = {
      title,
      description,
      createdBy: currentUser.id,
      currentDepartmentId: initialDepartmentId,
      status: 'active',
      history: [{
        id: crypto.randomUUID(),
        action: 'created',
        toDepartmentId: initialDepartmentId,
        byUserId: currentUser.id,
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, 'workflowTasks'), newTask);
    
    const message = \`ڕاسپاردەیەکی نوێ: "\${title}" ئاراستەی بەشەکەت کرا.\`;
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
      id: crypto.randomUUID(),
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
    
    const message = \`ڕاسپاردەی "\${task.title}" ئاراستەی بەشەکەت کرا.\`;
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
      id: crypto.randomUUID(),
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
      addNotification(task.createdBy, \`ڕاسپاردەی "\${task.title}" تەواوکرا!\`, 'workflow_completed').catch(console.error);
    }
  };

  const markNotificationRead = async (id: string) => {`;

code = code.replace(methodsTarget, methodsReplacement);

const providerTarget = `    <AppContext.Provider value={{
      currentUser: computedCurrentUser, users, logs, departments, activities, notifications, instagramPosts, loading,`;
const providerReplacement = `    <AppContext.Provider value={{
      currentUser: computedCurrentUser, users, logs, departments, activities, workflowTasks, notifications, instagramPosts, loading,
      createWorkflowTask, forwardWorkflowTask, completeWorkflowTask,`;

code = code.replace(providerTarget, providerReplacement);

const returnUnsubscribeTarget = `    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
      unsubscribeDepts();
      unsubscribeActivities();
      unsubscribeNotifications();
      unsubscribeInsta();
      unsubscribeAbout();
    };`;
const returnUnsubscribeReplacement = `    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
      unsubscribeDepts();
      unsubscribeActivities();
      unsubscribeWorkflowTasks();
      unsubscribeNotifications();
      unsubscribeInsta();
      unsubscribeAbout();
    };`;
code = code.replace(returnUnsubscribeTarget, returnUnsubscribeReplacement);


fs.writeFileSync('src/store/AppContext.tsx', code);
console.log('patched AppContext for workflowTasks');
