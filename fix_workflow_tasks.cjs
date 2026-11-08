const fs = require('fs');

let ctx = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

// Add unsubWorkflowTasks declaration
ctx = ctx.replace(/let unsubActs: any;/, "let unsubActs: any;\n    let unsubWorkflowTasks: any;");

// Add onSnapshot
const target = `        unsubActs = onSnapshot(collection(db, 'activities'), (snapshot) => {
          setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityTask)));
        });`;
const repl = `        unsubActs = onSnapshot(collection(db, 'activities'), (snapshot) => {
          setActivities(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ActivityTask)));
        });
        unsubWorkflowTasks = onSnapshot(collection(db, 'workflowTasks'), (snapshot) => {
          setWorkflowTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WorkflowTask)));
        });`;
ctx = ctx.replace(target, repl);

// Add cleanup
const cleanupTarget = `      if (unsubActs) unsubActs();`;
const cleanupRepl = `      if (unsubActs) unsubActs();
      if (unsubWorkflowTasks) unsubWorkflowTasks();`;
ctx = ctx.replace(cleanupTarget, cleanupRepl);

fs.writeFileSync('src/store/AppContext.tsx', ctx);
console.log('Fixed workflowTasks snapshot');
