const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

const targetBlockStart = content.indexOf('          activeTasks.map(task => {');
const targetBlockEnd = content.indexOf('          })', targetBlockStart) + 12;

const newBlock = `          activeTasks.map(task => {
            const currentDept = departments.find(d => d.id === task.currentDepartmentId);
            const creator = users.find(u => u.id === task.createdBy);
            const canManage = currentUser?.roles?.includes('Admin') || currentUser?.departments?.includes(task.currentDepartmentId);
            
            const stepsItems: string[] = [];
            task.history.forEach(h => {
              if (h.action === 'created' || h.action === 'forwarded') {
                const dept = departments.find(d => d.id === h.toDepartmentId);
                stepsItems.push(dept?.name || 'بەش');
              }
            });
            if (task.status === 'completed') {
              stepsItems.push('کۆتایی');
            }
            
            const currentStep = task.status === 'completed' ? stepsItems.length + 1 : stepsItems.length;

            return (
              <div key={task.id} className="p-6 border border-surface-border rounded-[24px] bg-white shadow-sm flex flex-col gap-6 w-full overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-neutral-800 text-lg mb-2">{task.title}</h4>
                    <p className="text-neutral-500 text-sm mb-4">{task.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                        <Icon icon="solar:user-bold" /> دروستکەر: {creator?.name || 'نەناسراو'}
                      </span>
                    </div>
                  </div>
                  
                  {canManage && (
                    <div className="flex gap-2 w-full md:w-auto shrink-0">
                      <button 
                        onClick={() => setForwardModal({task})}
                        className="flex-1 md:flex-none px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <Icon icon="solar:forward-bold" /> ئاراستەکردن
                      </button>
                      <button 
                        onClick={() => handleComplete(task.id)}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <Icon icon="solar:check-read-bold" /> کۆتایی
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full pt-4 border-t border-surface-border">
                    <ul aria-label="Steps" className="items-center text-gray-600 font-medium md:flex overflow-x-auto pb-4 md:pb-0">
                        {stepsItems.map((item, idx) => (
                            <li key={idx} aria-current={currentStep == idx + 1 ? "step" : false} className="flex-1 last:flex-none flex md:items-center min-w-[120px]">
                                <div className="flex gap-x-3">
                                    <div className="flex items-center flex-col gap-x-2">
                                        <div className={\`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center \${currentStep > idx + 1 ? "bg-primary border-primary" : "" || currentStep == idx + 1 ? "border-primary" : ""}\`}>
                                            <span className={\` \${currentStep > idx + 1 ? "hidden" : "" || currentStep == idx + 1 ? "text-primary" : ""}\`}>
                                                {idx + 1}
                                            </span>
                                            {
                                                currentStep > idx + 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                ) : ""
                                            }
                                        </div>
                                        <div className={\`h-12 flex items-center md:hidden \${idx + 1 == stepsItems.length ? "hidden" : ""}\`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-8 flex items-center md:h-auto">
                                        <h3 className={\`text-sm \${currentStep == idx + 1 ? "text-primary font-bold" : ""}\`}>
                                            {item}
                                        </h3>
                                    </div>
                                </div>
                                <div className={\`flex-1 hidden md:block \${idx + 1 == stepsItems.length ? "md:hidden" : ""}\`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto text-gray-500 rtl:rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
            )
          })`;

content = content.substring(0, targetBlockStart) + newBlock + content.substring(targetBlockEnd);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
