import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

modal_jsx = """
        {/* Receipt Modal */}
        <AnimatePresence>
          {receiptLog && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setReceiptLog(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full overflow-hidden border border-neutral-100 relative"
              >
                {/* Decorative top receipt edge */}
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-neutral-100 to-white flex justify-around">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-b-full bg-white shadow-sm mt-[-4px]"></div>
                  ))}
                </div>

                <div className="p-8 pt-10 text-center relative">
                  <button 
                    onClick={() => setReceiptLog(null)}
                    className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="hugeicons:cancel-01" width={18} />
                  </button>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                    <Icon icon="hugeicons:task-done-01" width={32} />
                  </div>
                  
                  <h3 className="font-extrabold text-2xl text-neutral-800 mb-1">وەسڵی چالاکی</h3>
                  <p className="text-sm text-neutral-500 font-medium">{receiptLog.date}</p>
                  
                  <div className="border-t border-dashed border-neutral-200 my-6"></div>
                  
                  <div className="space-y-4 text-right">
                    <div>
                      <p className="text-xs text-neutral-400 font-bold mb-1">ناوی چالاکی</p>
                      <p className="font-bold text-neutral-800">{activities.find(a => a.id === receiptLog.taskId)?.name || 'نەناسراو'}</p>
                    </div>
                    
                    {receiptLog.quantity && (
                      <div>
                        <p className="text-xs text-neutral-400 font-bold mb-1">بڕی ئەنجامدراو</p>
                        <p className="font-bold text-neutral-800">{receiptLog.quantity}</p>
                      </div>
                    )}
                    
                    {receiptLog.notes && (
                      <div>
                        <p className="text-xs text-neutral-400 font-bold mb-1">تێبینییەکان</p>
                        <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-100">{receiptLog.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-dashed border-neutral-200 my-6"></div>
                  
                  <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <span className="font-bold text-emerald-800">کۆی خاڵەکان</span>
                    <span className="text-2xl font-black text-emerald-600">+{receiptLog.totalPoints}</span>
                  </div>
                  
                </div>
                
                {/* Decorative bottom receipt edge */}
                <div className="h-4 bg-gradient-to-t from-neutral-100 to-white flex justify-around relative overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-t-full bg-white shadow-sm mb-[-4px] absolute bottom-0" style={{ left: `${(i * 100) / 20}%` }}></div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
"""

end_pattern = re.compile(r'        \{/\* Award Badge Modal \*/\}')

if end_pattern.search(content):
    content = end_pattern.sub(modal_jsx + "\n        {/* Award Badge Modal */}", content)
    print("Modal injected")
else:
    print("End pattern not found")

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)

