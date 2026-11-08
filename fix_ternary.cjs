const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

content = content.replace(
  /\${currentStep > idx \+ 1 \? "bg-primary border-primary" : "" \|\| currentStep == idx \+ 1 \? "border-primary" : ""}/g,
  "${currentStep > idx + 1 ? 'bg-primary border-primary' : (currentStep === idx + 1 ? 'border-primary' : 'border-neutral-300')}"
);

content = content.replace(
  /\${currentStep > idx \+ 1 \? "hidden" : "" \|\| currentStep == idx \+ 1 \? "text-primary" : ""}/g,
  "${currentStep > idx + 1 ? 'hidden' : (currentStep === idx + 1 ? 'text-primary' : 'text-neutral-500')}"
);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
