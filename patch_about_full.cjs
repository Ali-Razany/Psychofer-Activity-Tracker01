const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../store/AppContext';

export function About() {
  const [activeTab, setActiveTab] = useState('intro');
  const { users, departments } = useAppContext();

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

  // Filter users to only show those who have avatars
  const team = users.filter(u => u.avatar && u.avatar.trim() !== '');

  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-surface-paper p-6 md:p-8 rounded-[24px] border border-surface-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">
            <Icon icon="solar:info-circle-bold-duotone" className="text-primary" width={28} />
            دەربارەی سایکۆفێر
          </h2>
          <p className="text-neutral-500 mt-1">زانیاری و ناساندنی تیمی کارکردن</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-full w-full md:w-auto overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('intro')}
            className={\`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all \${
              activeTab === 'intro' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }\`}
          >
            ناساندن
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={\`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all \${
              activeTab === 'team' ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }\`}
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
            <div className="max-w-3xl space-y-6">
              <h3 className="text-2xl font-bold text-primary">پڕۆژەی سایکۆفێر</h3>
              <p className="text-neutral-600 leading-relaxed text-lg">
                سایکۆفێر ناوەندێکی تایبەتە بۆ بڵاوکردنەوەی هۆشیاریی دەروونی و کۆمەڵایەتی... پلاتفۆرمەکەمان ئامانجییەتی کە ببێتە سەرچاوەیەکی متمانەپێکراو بۆ وەرگێڕان و بڵاوکردنەوەی بابەتە دەروونییەکان بە زمانی کوردی.
              </p>
              <div className="p-6 bg-primary/5 rounded-[20px] border border-primary/10">
                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <Icon icon="solar:target-bold-duotone" width={24} />
                  ئامانجمان
                </h4>
                <p className="text-neutral-700 leading-relaxed">
                  برەودان بە تەندروستی دەروونی و پێشکەشکردنی زانیاری دروست و زانستی بە کۆمەڵگەی کوردی لە ڕێگەی دەستەیەکی لێهاتوو و بەتواناوە.
                </p>
              </div>
            </div>
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
                <h3 className="text-neutral-800 text-3xl font-bold sm:text-4xl">
                  تیمی کارکردنمان بناسە
                </h3>
                <p className="text-neutral-600 mt-3 text-lg">
                  لێرەدا ئەو کەسانە دەناسیت کە لە پشتەوەی بەرهەمەکانی سایکۆفێرن. کۆمەڵێک گەنجی بەتوانا و لێهاتوو کە ئامانجیان خزمەتکردنە.
                </p>
              </div>
              <ul className="grid gap-12 lg:grid-cols-2">
                {team.map((user, idx) => (
                  <li key={idx} className="gap-8 sm:flex group">
                    <div className="w-full sm:w-48 h-60 shrink-0 overflow-hidden rounded-[24px] shadow-sm">
                      <img
                        src={user.avatar}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        alt={user.name}
                      />
                    </div>
                    <div className="mt-6 sm:mt-0 flex flex-col justify-center">
                      <h4 className="text-xl text-neutral-800 font-bold">{user.name}</h4>
                      <p className="text-primary font-medium mt-1">
                        {user.jobTitle || departments.find(d => d.id === user.departments?.[0])?.name || getRoleName(user.roles)}
                      </p>
                      <p className="text-neutral-500 mt-4 leading-relaxed text-sm">
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
\`;

fs.writeFileSync('src/components/About.tsx', code);
