import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useAppContext } from '../store/AppContext';
import { AboutInfo } from '../types';

export function About() {
  const [activeTab, setActiveTab] = useState('intro');
  const { users, departments, currentUser, aboutInfo, updateAboutInfo } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AboutInfo>>({});

  const defaultContent = `
**ئێمە وەک تیمی سایکۆفێر (Psychosphere)**
ئێمە لێرە کۆبووینەتەوە وەک تیمێکی خۆبەخش، زانستی و سەربەخۆ، کە ئامانجی سەرەکیمان خزمەتکردنی کۆمەڵگەیە لە بواری دەروونزانیدا. ئێمە وەک خوێندکاران و پسپۆڕانی بەشە دەروونییەکان، پێکەوە کاردەکەین بۆ بڵاوکردنەوەی هۆشیاریی دەروونی.

### ئامانجەکانمان لەم کارەدا
ئامانجی ئێمە وەک تیمێک ئەوەیە کە پێکەوە کاربکەین بۆ ئاشناکردنی تاکەکانی کۆمەڵگە بە گرنگیی تەندروستیی دەروونی. ئێمە لێرەین بۆ ئەوەی بە هەوڵی هاوبەشمان زانیارییە دەروونییەکان بە شێوەیەکی زانستی و باوەڕپێکراو بگەیەنینە دەستی خوێنەران.

### پێکهاتە و ژینگەی کارکردنمان
ئێمە هەموومان لەم سیستەمەدا بەشێکین لە خێزانێک کە پێکدێت لە قوتابییان و پسپۆڕانی بواری دەروونزانی. ئێمەی گەنج لێرە پشت بە توانا و لێهاتووییەکانی یەکتر دەبەستین. پێکەوە ژینگەیەکی یارمەتیدەر و پاڵپشتیکارمان خولقاندووە کە هاندەری داهێنانمانە. لە ڕووی کارگێڕییەوە، کارەکانمان بەسەر چەندین دەستەی جیاوازدا دابەشکردووە، تاوەکوو هەر یەکێکمان ڕۆڵی خۆی بە باشترین شێوە ببینێت.

هەیکەلی کارگێڕیی ناوخۆییمان بەم شێوەیە ڕێکخستووە:

*   **سەرپەرشتیاری گشتیی سایکۆفێر:** بەرپرسی داڕشتنی پلان و پەیڕەوی ناوخۆییمانە و سەرپەرشتیاری تەواوی کارەکانمان دەکات.
*   **سەرپەرشتیاری بەشە دەروونییەکان:** نوێنەرایەتی بەشەکەی خۆی دەکات و سەرپەرشتی چالاکییەکانی ئێمە لەوێ دەکات.
*   **سەرپەرشتیاری دەستەکان:** بەڕێوەبردنی ئەو دەستەیەی لە ئەستۆیە کە ئەرکەکانی تێدا ڕێکدەخات بۆ ئێمە.
*   **یاریدەدەری سەرپەرشتیار:** جێگر و هاوکاری سەرپەرشتیارەکانمانە.
*   **ئەندامەکان:** ئێمەین، کە لە یەک یان چەند دەستەیەکدا بەشدارین و ئەرکەکانمان بەباشترین شێوە جێبەجێ دەکەین.

### بنەماکانی کارکردنمان
ئێمە لەسەر پێنج بنەمای سەرەکی پێکەوە کار دەکەین:

1.  **خودکارایی:** هاندانی یەکتر بۆ پشتبەستن بە تواناکانی خۆمان و هاوبەشیپێکردنیان لەگەڵ یەکتر.
2.  **پڕکردنەوەی پێداویستییەکانمان:** بەکارهێنانی وزەی یەکتر بۆ پڕکردنەوەی کەلێنە ئەکادیمییەکانمان.
3.  **پەرەدان بە ئەزموونمان:** یارمەتیدانی یەکتر بۆ گونجاندنی ئەزموونە کەسی و پیشەیییەکانمان.
4.  **بەرزکردنەوەی ئاستی مەعریفی:** ڕەخساندنی کەشێکی زانستی لەناو خۆماندا کە هاندەر بێت بۆ بەرەوپێشبردنی ئاستی زانیاریمان.
5.  **قوتابیی بەرهەمهێن:** ئێمە دەمانەوێت هەموومان ببینە کەسانێکی بەرهەمدار و سوودبەخش بۆ کۆمەڵگەکەمان.

### بەرهەم و چالاکییەکانمان
ئێمە بە هەوڵی هەموومان، کار و چالاکییەکانمان لە چەندین بواردا چڕ کردووەتەوە:

*   **گۆڤاری سایکۆفێر:** بەرهەمی ماندووبوونی هەموومانە کە ئێستا تاکە گۆڤاری تایبەتمەندە بە زمانی کوردی.
*   **پێشبڕکێی ساڵانەمان:** دەستپێشخەرییەکی نوێمانە لە نێوان زانکۆکاندا.
*   **وەرگێڕان و بڵاوکراوەکانمان:** پێکەوە سەرچاوە زانستییەکان وەردەگێڕین و بڵاویان دەکەینەوە.
*   **کاری مەیدانی و وێبینار:** خول و وێبینار ڕێکدەخەین بۆ گەیاندنی پەیامەکەمان بە خوێندکارانی تر.
`;
  const handleEditClick = () => {
    setEditForm({ content: aboutInfo?.content || defaultContent });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (updateAboutInfo) {
        await updateAboutInfo(editForm);
      }
      setIsEditing(false);
    } catch(err) {
      alert('هەڵەیەک ڕوویدا لە کاتی هەڵگرتندا');
    }
  };

  const getRoleName = (roles?: string[]) => {
    if (!roles || roles.length === 0) return 'ئەندام';
    const role = roles[0];
    switch(role) {
      case 'Admin': return 'سەرپەرشتیاری گشتی';
      case 'AssistantAdmin': return 'یاریدەدەری سەرپەرشتیار';
      case 'DepartmentRep': return 'نوێنەری بەش';
      case 'Supervisor': return 'سەرپەرشتیاری دەستە';
      default: return 'ئەندام';
    }
  };

  const team = users;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4">
            <h2 className="text-[14px] font-bold text-neutral-800 flex items-center gap-2">
              <Icon icon="solar:info-circle-bold-duotone" className="text-primary" width={28} />
              دەربارەی سایکۆفێر
            </h2>
            {currentUser?.roles.includes('Admin') && (
              <button 
                onClick={handleEditClick}
                className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
                title="گۆڕانکاری لە دەربارە"
              >
                <Icon icon="solar:pen-bold-duotone" width={20} />
              </button>
            )}
          </div>
          <p className="text-neutral-500 mt-1">زانیاری و ناساندنی تیمی کارکردن</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-full w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'intro' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            ناساندن
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'team' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            تیمی کارکردن
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-paper rounded-[24px] p-6 md:p-10 shadow-sm border border-surface-border"
          >
            {isEditing ? (
              <div className="max-w-4xl space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">دەق (Markdown ڕێگەپێدراوە)</label>
                  <textarea
                    rows={20}
                    className="w-full px-4 py-4 border border-surface-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y"
                    value={editForm.content || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveEdit} className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">پاشەکەوتکردن</button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors">پاشگەزبوونەوە</button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl text-neutral-800 leading-relaxed text-right space-y-4" dir="rtl">
                <Markdown
                  components={{
                    h3: ({node, ...props}) => <h3 className="text-[14px] md:text-xl font-bold text-neutral-900 mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-neutral-700 leading-relaxed mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-700" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-neutral-900" {...props} />,
                    a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />
                  }}
                >
                  {aboutInfo?.content || defaultContent}
                </Markdown>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-surface-paper rounded-[24px] p-6 md:p-8 shadow-sm border border-surface-border"
          >
            <div className="max-w-screen-xl mx-auto">
              <div className="max-w-xl mb-12">
                <h3 className="text-[14px] text-neutral-800 font-bold sm:text-4xl">
                  تیمی کارکردنمان بناسە
                </h3>
                <p className="text-neutral-600 mt-3 text-lg">
                  ئەو هاوڕێیانەت بناسە کە لە پشت بەرهەمەکانی سایکۆفێرەوەن، کۆمەڵێک گەنجی بەتوانا و لێهاتوو کە ئامانجیان خزمەتکردنە.
                </p>
              </div>
              <ul className="grid gap-12 lg:grid-cols-2">
                {team.map((user, idx) => (
                  <li key={idx} className="gap-8 sm:flex group">
                    <div className="w-full sm:w-48 h-60 shrink-0 overflow-hidden rounded-[24px] shadow-sm">
                      {user.avatar ? (
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        alt={user.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-bg flex items-center justify-center text-4xl font-bold text-neutral-400">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    </div>
                    <div className="mt-6 sm:mt-0 flex flex-col justify-center">
                      <h4 className="text-[14px] text-neutral-800 font-bold">{user.name}</h4>
                      <p className="text-primary font-medium mt-1">
                        {user.jobTitle || departments.find(d => d.id === user.departments?.[0])?.name || getRoleName(user.roles)}
                      </p>
                      <p className="text-neutral-500 mt-4 leading-relaxed text-[12px] sm:text-sm">
                        {user.bio || "ئەندامێکی چالاکی تیمی سایکۆفێر، بەشدارە لە پەرەپێدان و بڵاوکردنەوەی هۆشیاری دەروونی."}
                      </p>
                      <div className="mt-6 flex gap-4 text-neutral-400" dir="ltr">
                        {user.socials?.instagram && (
                          <a href={user.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                            <Icon icon="mdi:instagram" width={24} />
                          </a>
                        )}
                        {user.socials?.facebook && (
                          <a href={user.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">
                            <Icon icon="mdi:facebook" width={24} />
                          </a>
                        )}
                        {user.socials?.telegram && (
                          <a href={user.socials.telegram} target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">
                            <Icon icon="mdi:telegram" width={24} />
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
