const fs = require('fs');
let content = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

// Ensure CustomBadge is imported
if (!content.includes('CustomBadge')) {
  content = content.replace('WorkflowHistoryItem} from', 'WorkflowHistoryItem, CustomBadge} from');
}

// Add types to interface
content = content.replace(
  'activities: ActivityTask[];',
  'activities: ActivityTask[];\n  customBadges: CustomBadge[];\n  addCustomBadge: (badge: CustomBadge) => Promise<void>;\n  updateCustomBadge: (badge: CustomBadge) => Promise<void>;\n  deleteCustomBadge: (id: string) => Promise<void>;'
);

// Add state
content = content.replace(
  'const [activities, setActivities] = useState<ActivityTask[]>([]);',
  'const [activities, setActivities] = useState<ActivityTask[]>([]);\n  const [customBadges, setCustomBadges] = useState<CustomBadge[]>([]);'
);

// Add listener
const unsubActsPos = content.indexOf("unsubActs = onSnapshot(collection(db, 'activities')");
if (unsubActsPos !== -1) {
  const insertCode = `
        let unsubBadges = () => {};
        unsubBadges = onSnapshot(collection(db, 'badges'), (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CustomBadge[];
          setCustomBadges(data);
        });
  `;
  content = content.replace("unsubActs = onSnapshot(collection(db, 'activities')", insertCode.trim() + "\n        unsubActs = onSnapshot(collection(db, 'activities')");
}

// Cleanup listener
content = content.replace(
  'unsubActs();',
  'unsubActs();\n          if (typeof unsubBadges === "function") unsubBadges();'
);

// Add functions
const addActivityPos = content.indexOf("const addActivity = async");
const customBadgeFunctions = `
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
`;
content = content.replace('const addActivity = async', customBadgeFunctions + '\n  const addActivity = async');

// Add to context provider value
content = content.replace(
  'activities, workflowTasks,',
  'activities, customBadges, addCustomBadge, updateCustomBadge, deleteCustomBadge, workflowTasks,'
);

fs.writeFileSync('src/store/AppContext.tsx', content);
