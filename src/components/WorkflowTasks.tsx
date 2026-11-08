import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { WorkflowTask } from '../types';

export function WorkflowTasks() {
  const { currentUser, departments, workflowTasks, createWorkflowTask, forwardWorkflowTask, completeWorkflowTask, users } = useAppContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    const newSet = new Set(expandedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setExpandedTasks(newSet);
  };
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [initialDept, setInitialDept] = useState('');
  
  const [forwardModal, setForwardModal] = useState<{task: WorkflowTask} | null>(null);
  const [nextDept, setNextDept] = useState('');
  const [note, setNote] = useState('');

  const canCreate = currentUser?.roles?.some(r => ['Admin', 'AssistantAdmin', 'Supervisor', 'DepartmentRep'].includes(r));
  
  const activeTasks = workflowTasks.filter(t => t.status === 'active');
  const completedTasks = workflowTasks.filter(t => t.status === 'completed');

  const handleCreate = async () => {
    if (!title || !initialDept) return;
    await createWorkflowTask(title, desc, initialDept);
    setTitle('');
    setDesc('');
    setInitialDept('');
    setShowCreateModal(false);
  };

  const handleForward = async () => {
    if (!forwardModal || !nextDept) return;
    await forwardWorkflowTask(forwardModal.task.id, nextDept, note);
    setNextDept('');
    setNote('');
    setForwardModal(null);
  };
  
  const handleComplete = async (taskId: string) => {
    if(confirm('دڵنیایت لە تەواوکردنی ئەم ئەرکە؟')) {
      await completeWorkflowTask(taskId, 'کۆتایی پێهات');
    }
  };

  return (
    <div className="bg-surface-paper rounded-[24px] p-6 shadow-sm border border-surface-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[14px] font-bold md:text-lg text-neutral-900 flex items-center gap-2">
          <Icon icon="solar:round-transfer-bold-duotone" className="text-primary" width={24} />
          پڕۆسە و ڕاسپاردەکان
        </h3>
        {canCreate && (
          <button 
            onClick={() => setShowCreateModal(true)}
            title="ڕاسپاردنی ئەرک"
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Icon icon="solar:add-circle-bold" className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activeTasks.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            هیچ ڕاسپاردەیەکی چالاک نییە
          </div>
        ) : (
          activeTasks.map(task => {
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
            const isExpanded = expandedTasks.has(task.id);

            return (
              <div key={task.id} className="p-3 md:p-6 border border-surface-border rounded-[16px] md:rounded-[24px] bg-white shadow-sm flex flex-col gap-3 md:gap-6 w-full overflow-hidden">
                <div 
                  className="flex flex-col md:flex-row justify-between items-start gap-4 cursor-pointer hover:bg-neutral-50 p-2 -m-2 rounded-xl transition-colors"
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex-1">
                    <h4 className="text-[14px] font-bold text-neutral-800 md:text-lg mb-1 md:mb-2">{task.title}</h4>
                    <p className="text-neutral-500 text-[12px] md:text-sm mb-2 md:mb-4 leading-tight md:leading-normal">{task.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-neutral-100 text-neutral-600 px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 font-medium text-[12px] md:text-xs">
                        <Icon icon="solar:user-bold" /> دروستکەر: {creator?.name || 'نەناسراو'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-neutral-400 mt-1">
                    <Icon icon={isExpanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                <AnimatePresence>
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
                                              <div className={`w-[19px] h-[19px] md:w-8 md:h-8 text-[12px] md:text-sm rounded-full border-2 flex-none flex items-center justify-center ${currentStep > idx + 1 ? 'bg-primary border-primary' : (currentStep === idx + 1 ? 'border-primary' : 'border-neutral-300')}`}>
                                                  <span className={` ${currentStep > idx + 1 ? 'hidden' : (currentStep === idx + 1 ? 'text-primary' : 'text-neutral-500')}`}>
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
                                              <div className={`h-4 flex items-center md:hidden ${idx + 1 == stepsItems.length ? "hidden" : ""}`}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 md:w-5 md:h-5 text-gray-500">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                  </svg>
                                              </div>
                                          </div>
                                          <div className="h-8 flex items-center md:h-auto mb-3 md:mb-0 pl-[14px] md:pl-0">
                                              <h3 className={`text-[12px] md:text-sm ${currentStep == idx + 1 ? "text-primary font-bold" : ""}`}>
                                                  {item}
                                              </h3>
                                          </div>
                                      </div>
                                      <div className={`flex-1 hidden md:block ${idx + 1 == stepsItems.length ? "md:hidden" : ""}`}>
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
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-[14px] md:text-xl font-bold mb-4">ڕاسپاردنی ئەرکی نوێ</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">ناونیشان</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-surface-border rounded-xl px-4 py-2 focus:ring-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">وردەکاری</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full border border-surface-border rounded-xl px-4 py-2 focus:ring-2 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">بەشی جێبەجێکار (قۆناغی یەکەم)</label>
                  <select value={initialDept} onChange={e => setInitialDept(e.target.value)} className="w-full border border-surface-border rounded-xl px-4 py-2 focus:ring-2 outline-none">
                    <option value="">هەڵبژێرە...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleCreate} disabled={!title || !initialDept} className="flex-1 bg-primary text-white font-bold py-1.5 md:py-2 text-xs md:text-sm rounded-xl disabled:opacity-50">ڕاسپاردن</button>
                <button onClick={() => setShowCreateModal(false)} className="flex-1 bg-neutral-100 text-neutral-700 font-bold py-1.5 md:py-2 text-xs md:text-sm rounded-xl">پاشگەزبوونەوە</button>
              </div>
            </motion.div>
          </div>
        )}

        {forwardModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-xl"
            >
              <h3 className="text-[14px] md:text-xl font-bold mb-4">ئاراستەکردنی بۆ قۆناغی داهاتوو</h3>
              <p className="text-[12px] sm:text-sm text-neutral-500 mb-4">ئەم ئەرکە ڕەوانە بکە بۆ بەشێکی تر بۆ تەواوکردنی قۆناغی داهاتوو.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">بەشی داهاتوو</label>
                  <select value={nextDept} onChange={e => setNextDept(e.target.value)} className="w-full border border-surface-border rounded-xl px-4 py-2 focus:ring-2 outline-none">
                    <option value="">هەڵبژێرە...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">تێبینی (ئارەزوومەندانە)</label>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full border border-surface-border rounded-xl px-4 py-2 focus:ring-2 outline-none" />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={handleForward} disabled={!nextDept} className="flex-1 bg-blue-600 text-white font-bold py-1.5 md:py-2 text-xs md:text-sm rounded-xl disabled:opacity-50">ئاراستەکردن</button>
                <button onClick={() => setForwardModal(null)} className="flex-1 bg-neutral-100 text-neutral-700 font-bold py-1.5 md:py-2 text-xs md:text-sm rounded-xl">پاشگەزبوونەوە</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
