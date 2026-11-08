const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// Add expandedTasks state
content = content.replace(
  'const [showCreateModal, setShowCreateModal] = useState(false);',
  'const [showCreateModal, setShowCreateModal] = useState(false);\n  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());\n\n  const toggleTask = (taskId: string) => {\n    const newSet = new Set(expandedTasks);\n    if (newSet.has(taskId)) {\n      newSet.delete(taskId);\n    } else {\n      newSet.add(taskId);\n    }\n    setExpandedTasks(newSet);\n  };'
);

// Add isExpanded logic to map
content = content.replace(
  'const currentStep = task.status === \'completed\' ? stepsItems.length + 1 : stepsItems.length;',
  'const currentStep = task.status === \'completed\' ? stepsItems.length + 1 : stepsItems.length;\n            const isExpanded = expandedTasks.has(task.id);'
);

// Replace task div start
content = content.replace(
  '<div className="flex flex-col md:flex-row justify-between items-start gap-4">',
  '<div \n                  className="flex flex-col md:flex-row justify-between items-start gap-4 cursor-pointer hover:bg-neutral-50 p-2 -m-2 rounded-xl transition-colors"\n                  onClick={() => toggleTask(task.id)}\n                >'
);

// Replace the right side of the top header
content = content.replace(
  '{canManage && (',
  '<div className="text-neutral-400 mt-1">\n                    <Icon icon={isExpanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="w-5 h-5 md:w-6 md:h-6" />\n                  </div>\n                </div>\n\n                <AnimatePresence>\n                  {isExpanded && (\n                    <motion.div\n                      initial={{ height: 0, opacity: 0 }}\n                      animate={{ height: "auto", opacity: 1 }}\n                      exit={{ height: 0, opacity: 0 }}\n                      className="overflow-hidden"\n                    >\n                      {canManage && ('
);

// End of isExpanded block
const endSteps = '</ul>\n                </div>';
const replacementEndSteps = '</ul>\n                </div>\n                </motion.div>\n              )}\n              </AnimatePresence>';

content = content.replace(endSteps, replacementEndSteps);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
