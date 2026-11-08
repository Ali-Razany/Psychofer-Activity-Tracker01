const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Replace the redundant header in the Dashboard modal
const redundantHeader = `<div className="sticky top-0 bg-surface-paper/90 backdrop-blur-md p-4 border-b border-surface-border flex justify-between items-center z-10">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Icon icon="solar:round-transfer-bold-duotone" className="text-primary w-6 h-6" />
                  پڕۆسە و ڕاسپاردەکان
                </h2>
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>`;
              
const cleanCloseButton = `<div className="absolute top-4 left-4 z-20">
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-neutral-100/80 backdrop-blur-sm flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>`;

content = content.replace(redundantHeader, cleanCloseButton);

// Adjust modal padding
content = content.replace(
  '<div className="p-2 md:p-6">\n                <WorkflowTasks />\n              </div>',
  '<WorkflowTasks />'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
