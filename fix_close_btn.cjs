const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const oldModal = `<div className="absolute top-4 left-4 z-20 md:top-6 md:left-6">
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors shadow-sm"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>`;

const newModal = `<div className="flex justify-end mb-3 md:-mr-12">
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors shadow-md z-20"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>`;

content = content.replace(oldModal, newModal);
fs.writeFileSync('src/components/Dashboard.tsx', content);
