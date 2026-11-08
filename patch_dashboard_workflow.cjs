const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const targetImport = `import { TimelineWidget } from './TimelineWidget';`;
const replImport = `import { TimelineWidget } from './TimelineWidget';
import { WorkflowTasks } from './WorkflowTasks';`;

code = code.replace(targetImport, replImport);

const targetComp = `<TimelineWidget />`;
const replComp = `<WorkflowTasks />`;

code = code.replace(targetComp, replComp);

fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log('patched Dashboard');
