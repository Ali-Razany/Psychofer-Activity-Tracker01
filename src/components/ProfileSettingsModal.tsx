import React, { useState, useRef } from 'react';
import { User } from '../types';
import { Icon } from '@iconify/react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAppContext } from '../store/AppContext';
import { messaging } from '../lib/firebase';
import { getToken } from 'firebase/messaging';

interface ProfileSettingsModalProps {
  user: User;
  onClose: () => void;
}

export function ProfileSettingsModal({ user, onClose }: ProfileSettingsModalProps) {
  const { updateProfile } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user.email || '');
  const [name, setName] = useState(user.name || '');
  
  const [bio, setBio] = useState(user.bio || '');
  const [facebook, setFacebook] = useState(user.socials?.facebook || '');
  const [instagram, setInstagram] = useState(user.socials?.instagram || '');
  const [telegram, setTelegram] = useState(user.socials?.telegram || '');
  const [verifyingTelegram, setVerifyingTelegram] = useState(false);
  
  const verifyTelegram = async () => {
    if (!telegram) return;
    setVerifyingTelegram(true);
    setError('');
    try {
      const tgDoc = await getDoc(doc(db, 'telegram_links', telegram.toLowerCase()));
      if (tgDoc.exists() && tgDoc.data().chatId) {
        // Link successful
        try {
          await updateProfile(user.id, { socials: { ...user.socials, telegramChatId: tgDoc.data().chatId, telegram } });
          setError('تێلیگرامەکەت زۆر بەباشی پشتڕاست کرایەوە!');
        } catch(e) {
          setError('ئۆهـ! هەڵەیەک ڕوویدا لە کاتی پاشەکەوتکردندا.');
        }
      } else {
        setError('پشتڕاستکردنەوەکە سەرکەوتوو نەبوو. دڵنیابە لەوەی نامەی /start ـت ناردووە بۆ بۆتەکە.');
      }
    } catch(err) {
      setError('ئۆهـ! کێشەیەک لە هێڵەکەدایە.');
    } finally {
      setVerifyingTelegram(false);
    }
  };
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('تکایە تەنیا فایلێک هەڵبژێرە کە وێنە بێت');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('دەبێت قەبارەی وێنەکە لە ٢ مێگابایت کەمتر بێت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 256x256
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 256;

        if (width > height && width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        } else if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        } else if (width === 0 || height === 0) {
           width = maxDim;
           height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setAvatarPreview(dataUrl);
          setError('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      await updateProfile(user.id, {
        name,
        avatar: avatarPreview,
        email,
        
        bio,
        socials: { telegram, facebook, instagram, telegramChatId: user.socials?.telegram === telegram ? (user.socials?.telegramChatId || null) : null }
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'ئۆهـ! کێشەیەک هەیە لە پاشەکەوتکردنی زانیارییەکانت');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-surface-paper rounded-[28px] shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col" dir="rtl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-surface-border">
          <h2 className="text-[14px] md:text-xl font-bold text-neutral-800">ڕێکخستنەکانی هەژمار</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-neutral-600 hover:bg-surface-bg rounded-full transition-colors"
          >
            <Icon icon="mynaui:x" width={18} />
          </button>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-[20px] text-[12px] sm:text-sm mb-6 border border-red-100">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-custom"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-light/20 text-primary flex items-center justify-center text-2xl md:text-3xl font-bold border-4 border-white shadow-custom">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon icon="hugeicons:camera-01" width={18} />
              </div>
            </div>
            <p className="text-[12px] sm:text-sm text-neutral-500 mt-3 font-medium">گۆڕینی وێنەی پڕۆفایل</p>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ناوی تەواو</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="ناوی خۆت بنووسە"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئیمەیڵ</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="ئیمەیڵی خۆت بنووسە"
              />
            </div>

                        <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئاگادارکردنەوەی مۆبایل / وێب</label>
              <button
                type="button"
                
                onClick={async () => {
                  if (window.self !== window.top) {
                    alert('تکایە بەرنامەکە لە تابی نوێدا (New Tab) بکەرەوە بۆ چالاککردنی ئاگادارکردنەوەکان، چونکە لەناو ئەم چوارچێوەیەدا (iFrame) ڕێگەپێدراو نییە.');
                    return;
                  }
                  
                  const vapidKey = (import.meta as any).env.VITE_VAPID_KEY;
                  if (!vapidKey) {
                    alert('بۆ کارکردنی ئەم تایبەتمەندییە، پێویستە کلیلی VAPID لە بەشی ڕێکخستنەکانی ژینگە (Secrets / Environment Variables) بە ناوی VITE_VAPID_KEY زیاد بکەیت. دەتوانیت لە فایەربەیس دەستی بخەیت: Project Settings > Cloud Messaging > Web configuration.');
                    return;
                  }

                  try {
                    const perm = await window.Notification.requestPermission();
                    if (perm === 'granted' && messaging) {
                      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                      await navigator.serviceWorker.ready;
                      
                      const token = await getToken(messaging, { 
                        serviceWorkerRegistration: registration,
                        vapidKey: vapidKey 
                      });
                      
                      if (token) {
                        await updateProfile(user.id, { fcmToken: token });
                        try {
                          await registration.showNotification('سایکۆفێر', { body: 'ئاگادارکردنەوەکان چالاک کران!', dir: 'rtl', icon: '/vite.svg' });
                        } catch (e) {
                          console.log('Mobile notification fallback:', e);
                        }
                        alert('بە سەرکەوتوویی چالاک کرا، دەستخۆش!');
                      }
                    } else {
                      alert('ڕێگەپێدان ڕەت کرایەوە یان ئەم ئامێرە پشتگیری ناکات.');
                    }
                  } catch(e) {
                    console.error(e);
                    alert('ئۆهـ! کێشەیەک هەیە لە کاتی چالاککردندا: ' + String(e));
                  }
                }}

                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-[20px] px-4 py-2.5 font-medium transition-colors text-right flex items-center justify-between"
              >
                <span>چالاککردنی ئاگادارکردنەوەکان</span>
                <Icon icon="hugeicons:notification-03" width={20} />
              </button>
              <p className="text-xs text-neutral-500 mt-2">ئەمە ڕێگە دەدات ئاگادارکردنەوەکان ڕاستەوخۆ بێنە سەر شاشەی مۆبایلەکەت.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">کورتییەک دەربارەی خۆت (بایۆ)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[80px]"
                placeholder="بایۆیەک بنووسە..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">تێلیگرام (یوزەرنەیم)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value.replace('@', ''))}
                  className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                  placeholder="username"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={verifyTelegram}
                  disabled={!telegram || verifyingTelegram}
                  className="bg-primary/10 text-primary hover:bg-primary/20 px-4 rounded-[20px] font-bold transition-colors disabled:opacity-50 text-[12px] sm:text-sm whitespace-nowrap"
                >
                  {verifyingTelegram ? '...' : 'پشتڕاستکردنەوە'}
                </button>
              </div>
              <p className="text-[12px] text-neutral-500 mt-1">بۆ وەرگرتنی ئاگادارکردنەوەکان، یوزەرنەیمەکەت لێرە بنووسە و /start بنێرە بۆ <a href="https://t.me/PsychoferActivity2026bot" target="_blank" className="text-primary font-bold hover:underline">@PsychoferActivity2026bot</a> پاشان دوگمەی پشتڕاستکردنەوە دابگرە.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">فەیسبووک</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="https://facebook.com/..."
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">ئینستاگرام</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left"
                placeholder="@username"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 border-t border-surface-border bg-surface-bg flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-surface-paper border border-surface-border text-slate-700 rounded-[20px] font-medium hover:bg-surface-bg transition-colors"
          >
            پاشگەزبوونەوە
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-[20px] font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Icon icon="hugeicons:loading-02" width={18} className="animate-spin" /> : <Icon icon="hugeicons:checkmark" width={18} />}
            <span>پاشەکەوتکردن</span>
          </button>
        </div>
      </div>
    </div>
  );
}
