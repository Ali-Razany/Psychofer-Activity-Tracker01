const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const modalRegex = /<AnimatePresence>\s*{showWorkflowTasks && \([\s\S]*?<\/AnimatePresence>/;

const newModal = `<AnimatePresence>
        {showWorkflowTasks && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowWorkflowTasks(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setShowWorkflowTasks(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors shadow-md z-20"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto rounded-[24px] shadow-2xl flex-1 bg-surface-paper">
                <WorkflowTasks />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>`;

content = content.replace(modalRegex, newModal);
fs.writeFileSync('src/components/Dashboard.tsx', content);
