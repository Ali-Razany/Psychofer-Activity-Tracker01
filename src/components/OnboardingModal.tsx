import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAppContext } from '../store/AppContext';

const slides = [
  {
    id: 1,
    title: "بەخێربێیت بۆ خێزانی سایکۆفێر! 👋",
    description: "خۆشحاڵین کە لێرەیت. ئەم سیستەمە دروستکراوە بۆ ئەوەی ئێمە وەک تیمێک پێکەوە کارەکانمان ڕێکبخەین و بە ئاسانی ئامانجەکانمان بپێکین.",
    icon: "fluent-emoji:waving-hand"
  },
  {
    id: 2,
    title: "ئامانجی ئێمە چییە؟ 🎯",
    description: "ئامانجی سەرەکیمان بڵاوکردنەوەی هۆشیاریی دەروونییە. لێرەدا، هەر چالاکییەک کە دەیکەیت بەشدارە لەم ئامانجە گەورەیە و خزمەتێکی گەورە بە کۆمەڵگە دەگەیەنێت.",
    icon: "fluent-emoji:bullseye"
  },
  {
    id: 3,
    title: "سیستەمەکە چۆن کاردەکات؟ ⚙️",
    description: "لێرەدا ئەرکەکانت پێدەسپێردرێت. کاتێک کارێک تەواو دەکەیت و لە بەشی 'تۆمارکردنی چالاکی' دەینێریت، خاڵ بەدەست دەهێنیت! 🌟 ئەم خاڵانە دەبنە هۆی پێدانی باج و نیشانەی نوێ بە تۆ.",
    icon: "fluent-emoji:star"
  },
  {
    id: 4,
    title: "بەشە سەرەکییەکان 📚",
    description: "• داشبۆرد: بۆ بینینی ئاست و خاڵەکانت.\n• دیوەخان: بۆ گفتوگۆ و بیروڕا گۆڕینەوە.\n• تیمی کارکردن: بۆ ناسینی ئەندامانی تر.\n• ڕاسپاردەکان: بۆ بینین و ناردنی ئەرکەکانت.",
    icon: "fluent-emoji:books"
  },
  {
    id: 5,
    title: "قۆناغی تاقیکاری 🛠️",
    description: "ئەم سیستەمە لە ئێستادا تەنها تاقیکارییە. هەر تێبینییەکت هەیە بۆ بەرەوپێشبردن یان هەر کەموکوڕییەک دەبینیت، تکایە لە 'دیوەخانی گشتی' بۆمان بنووسە بۆ ئەوەی پێکەوە باشتری بکەین.",
    icon: "fluent-emoji:hammer-and-wrench"
  },
  {
    id: 6,
    title: "ئامادەیت؟ 🚀",
    description: "ئێستا تۆ بەشێکی گرنگی لەم پڕۆژەیە. با پێکەوە دەست پێبکەین، گۆڕانکاری دروست بکەین و سەرکەوتن تۆمار بکەین!",
    icon: "fluent-emoji:rocket"
  }
];

export function OnboardingModal() {
  const { currentUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const hasSeen = localStorage.getItem(`onboarding_${currentUser.id}`);
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [currentUser]);

  const handleClose = () => {
    if (currentUser) {
      localStorage.setItem(`onboarding_${currentUser.id}`, 'true');
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        >
          <div 
            className="bg-surface-paper rounded-[32px] shadow-2xl max-w-md w-full p-6 md:p-8 text-center relative overflow-hidden" 
            dir="rtl"
          >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-100" dir="ltr">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-center mb-6 mt-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-6xl shadow-inner">
                    <Icon icon={slide.icon} />
                  </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">{slide.title}</h2>
                
                <div className="text-neutral-600 leading-relaxed text-sm md:text-base min-h-[100px] whitespace-pre-line px-2">
                  {slide.description}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={handleClose} 
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold px-3 py-2 transition-colors"
              >
                پەڕاندن
              </button>
              
              <div className="flex gap-2">
                {currentSlide > 0 && (
                  <button 
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <Icon icon="mynaui:arrow-right" width={24} />
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="h-12 px-6 rounded-full bg-primary text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
                >
                  {currentSlide === slides.length - 1 ? 'دەستپێکردن' : 'دواتر'}
                  {currentSlide < slides.length - 1 && <Icon icon="mynaui:arrow-left" width={20} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
