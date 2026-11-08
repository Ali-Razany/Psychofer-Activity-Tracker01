import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';

export function ActivityForm() {
  const { currentUser, addLog, departments, activities } = useAppContext();
  const [department, setDepartment] = useState('');
  const [taskId, setTaskId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [quality, setQuality] = useState(1); // 1 is standard (100%), can be >1 for special efforts
  const [evidence, setEvidence] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser) return null;

  const filteredTasks = activities.filter(t => t.department === department);
  const selectedTask = activities.find(t => t.id === taskId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || quantity === '') return;

    const totalPoints = selectedTask.basePoints * (quantity as number) * quality;

    addLog({
      userId: currentUser.id,
      taskId: selectedTask.id,
      quantity: quantity as number,
      qualityModifier: quality,
      totalPoints,
      date: format(new Date(), 'yyyy-MM-dd'),
      evidence,
      notes,
      status: 'Pending'
    });

    setSuccess(true);
    setTaskId('');
    setQuantity('');
    setQuality(1);
    setEvidence('');
    setNotes('');
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Illustration */}
      <div className="bg-gradient-to-r from-primary-light/20 to-primary/10 rounded-[24px] p-8 flex items-center justify-between border border-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-[14px] md:text-2xl font-bold text-primary-dark mb-2">تۆمارکردنی چالاکی نوێ</h2>
          <p className="text-primary-dark/80">کارەکانی خۆت تۆمار بکە و خاڵەکانت کۆ بکەرەوە بۆ ئەوەی ئاستت بەرز ببێتەوە!</p>
        </div>
        <div className="relative z-10">
          <Icon icon="fluent-emoji:memo" className="w-16 h-16 md:w-20 md:h-20" />
        </div>
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Icon icon="fluent-emoji:memo" width={200} />
        </div>
      </div>

      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[20px] flex items-center gap-2">
          <Icon icon="hugeicons:check-circle" width={18} />
          <span>کارەکەت بە سەرکەوتوویی نێردرا، دەستخۆش!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">دەستە</label>
            <select 
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value as any);
                setTaskId('');
              }}
              className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled hidden>دەستەیەک هەڵبژێرە...</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">جۆری چالاکی</label>
            <select 
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">هەڵبژێرە...</option>
              {filteredTasks.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.basePoints} خاڵ)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">ژمارەی جارەکان (چەندییەتی)</label>
            <input 
              type="number"
              min="1"
              value={quantity}
              placeholder="بۆ نموونە: 1"
              onChange={(e) => {
                const val = e.target.value;
                setQuantity(val === '' ? '' : parseInt(val));
              }}
              className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">خاڵی پێشبینیکراو</label>
            <div className="w-full bg-primary/10 text-primary-dark font-bold border border-blue-100 rounded-[20px] px-4 py-2.5">
              {selectedTask ? selectedTask.basePoints * (quantity as number || 0) * quality : 0} خاڵ
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">بەڵگە (لینک یان ئاماژە)</label>
          <input 
            type="text"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="بەستەرەکەی لێرە دابنێ..."
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">تێبینی زیاتر (ئارەزوومەندانە)</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-surface-bg border border-surface-border rounded-[16px] md:rounded-[20px] p-3 md:p-4 text-[12px] md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 md:py-3 text-[12px] md:text-base rounded-[16px] md:rounded-[20px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Icon icon="hugeicons:floppy-disk" width={18} />
            تۆمارکردن
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}


