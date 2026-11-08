import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';

export function TimelineWidget() {
  const { currentUser } = useAppContext();
  const isAdmin = currentUser?.roles?.includes('Admin');
  
  const [steps, setSteps] = useState([
    "بیرۆکە و پلاندانان", 
    "ئامادەکردن", 
    "پێداچوونەوە", 
    "بڵاوکردنەوە"
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editSteps, setEditSteps] = useState([...steps]);
  const [title, setTitle] = useState("پڕۆسەی بەرهەمهێنان");
  const [editTitle, setEditTitle] = useState(title);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'timeline');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.steps && data.steps.length > 0) setSteps(data.steps);
        if (data.currentStep !== undefined) setCurrentStep(data.currentStep);
        if (data.title) setTitle(data.title);
      } else {
        // Initialize if doesn't exist
        setDoc(docRef, {
          steps: ["بیرۆکە و پلاندانان", "ئامادەکردن", "پێداچوونەوە", "بڵاوکردنەوە"],
          currentStep: 1,
          title: "پڕۆسەی بەرهەمهێنان"
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    const docRef = doc(db, 'settings', 'timeline');
    await setDoc(docRef, {
      steps: editSteps.filter(s => s.trim() !== ''),
      currentStep: currentStep,
      title: editTitle
    });
    setIsEditing(false);
  };

  const handleUpdateStep = async (step: number) => {
    if (!isAdmin) return;
    const docRef = doc(db, 'settings', 'timeline');
    await setDoc(docRef, { currentStep: step }, { merge: true });
  };

  if (isEditing && isAdmin) {
    return (
      <div className="bg-surface-paper rounded-[24px] p-6 shadow-sm border border-surface-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[14px] font-bold flex items-center gap-2">
            <Icon icon="solar:pen-new-square-bold-duotone" className="text-primary" width={24} />
            دەستکاریکردنی پڕۆسە
          </h3>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-full text-sm font-bold text-neutral-500 hover:bg-neutral-100">پاشگەزبوونەوە</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-full text-[12px] sm:text-sm font-bold bg-primary text-white hover:bg-primary-dark">پاشەکەوتکردن</button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">ناوی پڕۆسەکە</label>
            <input 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)} 
              className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">هەنگاوەکان</label>
            {editSteps.map((step, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">{idx + 1}</span>
                <input 
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...editSteps];
                    newSteps[idx] = e.target.value;
                    setEditSteps(newSteps);
                  }}
                  className="flex-1 bg-surface-bg border border-surface-border rounded-xl px-4 py-1.5 focus:ring-2 focus:ring-primary outline-none"
                />
                <button 
                  onClick={() => setEditSteps(editSteps.filter((_, i) => i !== idx))}
                  className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center"
                >
                  <Icon icon="solar:trash-bin-trash-bold" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => setEditSteps([...editSteps, "هەنگاوی نوێ"])}
              className="mt-2 text-sm text-primary font-bold flex items-center gap-1 hover:underline"
            >
              <Icon icon="solar:add-circle-bold" /> هەنگاو زیادبکە
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-paper rounded-[24px] p-6 shadow-sm border border-surface-border relative overflow-hidden">
      <div className="absolute -top-10 -right-10 text-primary/5 rotate-12 pointer-events-none">
        <Icon icon="solar:route-bold-duotone" width={140} />
      </div>
      
      <div className="flex justify-between items-center mb-8 relative z-10">
        <h3 className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icon icon="solar:flag-bold-duotone" width={18} />
          </div>
          {title}
        </h3>
        {isAdmin && (
          <button 
            onClick={() => {
              setEditSteps([...steps]);
              setEditTitle(title);
              setIsEditing(true);
            }} 
            className="text-neutral-400 hover:text-primary transition-colors p-2 bg-neutral-50 hover:bg-primary/5 rounded-full"
            title="دەستکاریکردنی پڕۆسە"
          >
            <Icon icon="solar:settings-bold-duotone" width={20} />
          </button>
        )}
      </div>

      <div className="w-full relative z-10 px-2" dir="ltr">
        <ul aria-label="Steps" className="items-center text-neutral-600 font-bold md:flex">
          {steps.map((item, idx) => (
            <li key={idx} aria-current={currentStep === idx + 1 ? "step" : false} className="flex-1 last:flex-none flex md:items-center relative group">
              <div className="flex gap-x-3 w-full cursor-pointer" onClick={() => handleUpdateStep(idx + 1)}>
                <div className="flex items-center flex-col gap-x-2">
                  <div className={`w-10 h-10 rounded-full border-[3px] flex-none flex items-center justify-center transition-all duration-300 shadow-sm
                    ${currentStep > idx + 1 ? "bg-primary border-primary text-white" : 
                      currentStep === idx + 1 ? "bg-white border-primary text-primary ring-4 ring-primary/20 scale-110" : 
                      "bg-white border-neutral-200 text-neutral-400 group-hover:border-neutral-300"}`}
                  >
                    <span className={currentStep > idx + 1 ? "hidden" : "text-sm"}>
                      {idx + 1}
                    </span>
                    {currentStep > idx + 1 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Icon icon="solar:check-read-bold" width={20} />
                      </motion.div>
                    )}
                  </div>
                  <div className={`h-12 w-0.5 md:hidden ${idx + 1 === steps.length ? "hidden" : ""} 
                    ${currentStep > idx + 1 ? "bg-primary" : "bg-neutral-200"}`}>
                  </div>
                </div>
                <div className="flex items-center md:h-10 mt-1 md:mt-0 md:absolute md:-bottom-8 md:left-1/2 md:-translate-x-1/2 whitespace-nowrap">
                  <h3 className={`text-sm ${currentStep === idx + 1 ? "text-primary font-extrabold" : currentStep > idx + 1 ? "text-neutral-800" : "text-neutral-400"}`}>
                    {item}
                  </h3>
                </div>
              </div>
              <div className={`flex-1 hidden md:block h-1 mx-2 rounded-full transition-colors duration-500
                ${idx + 1 === steps.length ? "md:hidden" : ""} 
                ${currentStep > idx + 1 ? "bg-primary" : "bg-neutral-200"}`}>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-10 md:h-12"></div>
    </div>
  );
}
