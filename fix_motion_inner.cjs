const fs = require('fs');
let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

// Replace everything inside the map function after toggleTask up to </AnimatePresence>
const regex = /<AnimatePresence>([\s\S]*?)<\/AnimatePresence>/;
const match = content.match(regex);
if(match) {
  content = content.replace(regex, `<AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 flex flex-col gap-4 border-t border-surface-border mt-4">
                        {canManage && (
                          <div className="flex gap-2 w-full md:w-auto shrink-0">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setForwardModal({task}); }}
                              className="flex-1 md:flex-none px-2 py-0 md:px-4 md:py-2 text-[12px] md:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1 md:gap-2 transition-colors h-[28px] md:h-auto"
                            >
                              <Icon icon="solar:forward-bold" /> ئاراستەکردن
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleComplete(task.id); }}
                              className="flex-1 md:flex-none px-2 py-0 md:px-4 md:py-2 text-[12px] md:text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg md:rounded-xl flex items-center justify-center gap-1 md:gap-2 transition-colors h-[28px] md:h-auto"
                            >
                              <Icon icon="solar:check-read-bold" /> کۆتایی
                            </button>
                          </div>
                        )}
                        <div className="w-full overflow-x-auto pb-4 md:pb-0">
                          <ul aria-label="Steps" className="items-center text-gray-600 font-medium flex md:flex">
                              {stepsItems.map((item, idx) => (
                                  <li key={idx} aria-current={currentStep == idx + 1 ? "step" : false} className="flex-1 last:flex-none flex md:items-center min-w-[70px] md:min-w-[120px]">
                                      <div className="flex gap-x-3">
                                          <div className="flex items-center flex-col gap-x-2">
                                              <div className={\`w-[19px] h-[19px] md:w-8 md:h-8 text-[9px] md:text-sm rounded-full border-2 flex-none flex items-center justify-center \${currentStep > idx + 1 ? 'bg-primary border-primary' : (currentStep === idx + 1 ? 'border-primary' : 'border-neutral-300')}\`}>
                                                  <span className={\` \${currentStep > idx + 1 ? 'hidden' : (currentStep === idx + 1 ? 'text-primary' : 'text-neutral-500')}\`}>
                                                      {idx + 1}
                                                  </span>
                                                  {
                                                      currentStep > idx + 1 ? (
                                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2.5 h-2.5 md:w-5 md:h-5 text-white">
                                                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                          </svg>
                                                      ) : ""
                                                  }
                                              </div>
                                              <div className={\`h-4 flex items-center md:hidden \${idx + 1 == stepsItems.length ? "hidden" : ""}\`}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 text-gray-500">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                  </svg>
                                              </div>
                                          </div>
                                          <div className="h-8 flex items-center md:h-auto mb-3 md:mb-0 pl-[14px] md:pl-0">
                                              <h3 className={\`text-[10px] md:text-sm \${currentStep == idx + 1 ? "text-primary font-bold" : ""}\`}>
                                                  {item}
                                              </h3>
                                          </div>
                                      </div>
                                      <div className={\`flex-1 hidden md:block \${idx + 1 == stepsItems.length ? "md:hidden" : ""}\`}>
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 mx-auto text-gray-500 rtl:rotate-180">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                          </svg>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>`);
}

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
