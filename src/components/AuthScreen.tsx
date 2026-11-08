import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useAppContext } from '../store/AppContext';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export function AuthScreen() {
  const { login, users } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        // Force admin for this specific email if they login but document is missing/wrong
        if (email.toLowerCase() === 'muhammed.abdulqadr6@gmail.com') {
           const { getAuth } = await import('firebase/auth');
           const user = getAuth().currentUser;
           if (user) {
             await setDoc(doc(db, 'users', user.uid), {
                name: 'عەلی ڕەزانی',
                email: email,
                role: 'Admin',
                department: 'Media',
                points: 0
             }, { merge: true });
           }
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        // If this is the very first user, or the specific admin email, make them Admin
        const role = (users.length === 0 || email.toLowerCase() === 'muhammed.abdulqadr6@gmail.com') ? 'Admin' : 'Member';
        
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: name || (email.toLowerCase() === 'muhammed.abdulqadr6@gmail.com' ? 'عەلی ڕەزانی' : ''),
          email: email,
          role: role,
          department: 'Media',
          points: 0
        });
      }
    } catch (err: any) {
      setError(err.message || 'هەڵەیەک ڕوویدا');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center rtl font-sans relative overflow-hidden" dir="rtl">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 opacity-20 pointer-events-none">
        <Icon icon="fluent-emoji:glowing-star" width={250} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-30 pointer-events-none transform -rotate-12">
        <Icon icon="fluent-emoji:rocket" width={180} />
      </div>
      <div className="absolute top-20 left-20 opacity-20 pointer-events-none">
        <Icon icon="fluent-emoji:open-book" width={120} />
      </div>

      <div className="bg-surface-paper p-8 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border w-[400px] text-center relative z-10">
        <div className="w-20 h-20 bg-primary-light/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/20">
          <Icon icon="fluent-emoji:brain" width={48} />
        </div>
        <h1 className="text-[14px] md:text-2xl font-bold text-neutral-800 mb-2">سایکۆفێر</h1>
        <p className="text-neutral-500 mb-6">سیستەمی تۆمارکردنی چالاکی ئەندامان</p>

        {error && <div className="mb-4 text-[12px] sm:text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-right">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ئیمەیڵ</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 text-left" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">وشەی نهێنی</label>
            <div className="relative" dir="ltr">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2 pr-10 text-left" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-500 hover:text-neutral-700"
                tabIndex={-1}
              >
                <Icon icon={showPassword ? "hugeicons:view-off" : "hugeicons:view"} width={20} />
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2.5 rounded-[20px] transition-colors disabled:opacity-50">
            {loading ? 'چاوەڕێبە...' : 'چوونە ژوورەوە'}
          </button>
        </form>

        
      </div>
    </div>
  );
}
