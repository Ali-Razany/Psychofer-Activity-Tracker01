const fs = require('fs');

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Add state
content = content.replace(
  'const [viewBadgeDetails, setViewBadgeDetails] = useState<any>(null);',
  'const [viewBadgeDetails, setViewBadgeDetails] = useState<any>(null);\n  const [showWorkflowTasks, setShowWorkflowTasks] = useState(false);'
);

// Replace <WorkflowTasks /> with a button
content = content.replace(
  '{/* Process Timeline */}\n      <WorkflowTasks />',
  `{/* Process Timeline */}\n      <div className="flex justify-start mb-4">\n        <button\n          onClick={() => setShowWorkflowTasks(true)}\n          className="flex items-center gap-2 px-6 py-3 bg-white border border-surface-border shadow-sm text-neutral-800 font-bold rounded-2xl hover:bg-neutral-50 transition-colors"\n        >\n          <Icon icon="solar:round-transfer-bold-duotone" className="text-primary w-6 h-6" />\n          پڕۆسە و ڕاسپاردەکان\n          <div className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">\n            <Icon icon="solar:arrow-left-linear" />\n          </div>\n        </button>\n      </div>`
);

// Add the modal at the end, just before </AnimatePresence> for the badges or in a new AnimatePresence
content = content.replace(
  '</AnimatePresence>\n    </div>',
  `</AnimatePresence>\n\n      {/* Workflow Tasks Modal */}\n      <AnimatePresence>\n        {showWorkflowTasks && (\n          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">\n            <motion.div\n              initial={{ opacity: 0 }}\n              animate={{ opacity: 1 }}\n              exit={{ opacity: 0 }}\n              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"\n              onClick={() => setShowWorkflowTasks(false)}\n            />\n            <motion.div\n              initial={{ opacity: 0, scale: 0.95, y: 20 }}\n              animate={{ opacity: 1, scale: 1, y: 0 }}\n              exit={{ opacity: 0, scale: 0.95, y: 20 }}\n              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl bg-surface-paper"\n            >\n              <div className="sticky top-0 bg-surface-paper/90 backdrop-blur-md p-4 border-b border-surface-border flex justify-between items-center z-10">\n                <h2 className="text-lg font-bold flex items-center gap-2">\n                  <Icon icon="solar:round-transfer-bold-duotone" className="text-primary w-6 h-6" />\n                  پڕۆسە و ڕاسپاردەکان\n                </h2>\n                <button\n                  onClick={() => setShowWorkflowTasks(false)}\n                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 transition-colors"\n                >\n                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />\n                </button>\n              </div>\n              <div className="p-2 md:p-6">\n                <WorkflowTasks />\n              </div>\n            </motion.div>\n          </div>\n        )}\n      </AnimatePresence>\n    </div>`
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
