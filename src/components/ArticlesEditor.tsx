import React, { useState, useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { RichTextEditor } from './RichTextEditor';
import { Icon } from '@iconify/react';
import { getTimeAgoKurdish } from '../lib/dateUtils';
import { toast } from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: any;
}

export function ArticlesEditor() {
  const { currentUser, users } = useAppContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleFont, setArticleFont] = useState('Vazirmatn, sans-serif');
  const isAdmin = (currentUser?.roles || []).includes('Admin');

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      setArticles(articlesData);
    });

    return () => unsubscribe();
  }, []);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !currentUser) return;
    setIsSubmitting(true);
    try {
      if (editingArticleId) {
        await updateDoc(doc(db, 'articles', editingArticleId), {
          title,
          content,
        });
      } else {
        await addDoc(collection(db, 'articles'), {
          title,
          content,
          authorId: currentUser.id,
          authorName: currentUser.name,
          timestamp: serverTimestamp()
        });
      }
      setTitle('');
      setContent('');
      setIsEditing(false);
      setEditingArticleId(null);
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/articles?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('بەستەر لەبەرگیراوەیە');
    });
  };

  const handleEditClick = (article: Article) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setContent(article.content);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('دڵنیایت دەتەوێت ئەم بابەتە بسڕیتەوە؟')) {
      await deleteDoc(doc(db, 'articles', id));
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <Icon icon="fluent-emoji:memo" width={28} />
          بابەت و ڕاپۆرتەکان (تاقیکاری)
        </h2>
        <div className="flex items-center gap-3">
          <select 
            value={articleFont}
            onChange={(e) => setArticleFont(e.target.value)}
            className="bg-surface-paper border border-surface-border text-neutral-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-primary shadow-sm"
          >
            <option value="Vazirmatn, sans-serif">فۆنتی بنەڕەتی</option>
            <option value="Arial, sans-serif">ئاریاڵ (Arial)</option>
            <option value="Tahoma, sans-serif">تاهۆما (Tahoma)</option>
            <option value="'Noto Naskh Arabic', serif">کلاسیک (Naskh)</option>
            <option value="'Noto Kufi Arabic', sans-serif">کوفی (Kufi)</option>
          </select>
          <button
          onClick={() => { setIsEditing(!isEditing); if(isEditing) { setEditingArticleId(null); setTitle(''); setContent(''); } }}
          className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          <Icon icon={isEditing ? "hugeicons:cancel-01" : "hugeicons:plus-sign"} width={18} />
          {isEditing ? 'پاشگەزبوونەوە' : 'نووسینی بابەت'}
        </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">ناونیشانی بابەت</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-bg border border-surface-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-neutral-800"
                placeholder="ناونیشانێکی گونجاو بنووسە..."
                required
              />
            </div>
            <div style={{ fontFamily: articleFont }}>
              <label className="block text-sm font-bold text-neutral-700 mb-2">ناوەڕۆکی بابەت</label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="ناوەڕۆکی بابەتەکەت لێرە بنووسە..."
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <Icon icon="fluent:spinner-ios-20-regular" className="animate-spin" width={18} />
                ) : (
                  <Icon icon="hugeicons:paper-plane" width={18} />
                )}
                {editingArticleId ? "نوێکردنەوە" : "بڵاوکردنەوە"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-surface-paper rounded-[24px] border border-dashed border-surface-border">
            <Icon icon="fluent-emoji:empty-nest" width={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-neutral-500">هیچ بابەتێک نییە. یەکەم کەس بە بۆ نووسین!</p>
          </div>
        ) : (
          articles.map((article) => {
            const author = users.find(u => u.id === article.authorId);
            const authorBio = author?.bio || 'نووسەر و ئەندام لە سیستەمی بەڕێوەبردن. ئەم بابەتە لە لایەن ئەم بەڕێزەوە نووسراوە و بڵاوکراوەتەوە بۆ سوودی گشتی و گەیاندنی زانیاری.';
            const authorAvatar = author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=random&size=100`;
            const authorJob = author?.jobTitle || 'نووسەر';
            return (
            <article key={article.id} className="relative mb-16 max-w-7xl mx-auto bg-[#fbfaf8] text-neutral-900 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12 rounded-none border border-neutral-200 shadow-sm" dir="rtl">
              
              {(currentUser?.id === article.authorId || isAdmin) && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <button 
                    onClick={() => handleEditClick(article)}
                    className="p-2 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-500 hover:text-white transition-colors border border-blue-100"
                    title="دەستکاریکردن"
                  >
                    <Icon icon="hugeicons:pencil-edit-01" width={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(article.id)}
                    className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-red-100"
                    title="سڕینەوە"
                  >
                    <Icon icon="solar:trash-bin-trash-bold" width={18} />
                  </button>
                </div>
              )}

              <header className="lg:col-span-12 border-b-4 border-neutral-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-neutral-900">گۆڤاری سیستەم</h1>
                <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{article.timestamp ? getTimeAgoKurdish(article.timestamp.toDate()) : 'نوێ'}</p>
              </header>

              <main className="lg:col-span-8 flex flex-col gap-8">
                <header>
                  <h2 className="text-3xl md:text-5xl font-black leading-[1.2] mb-4 text-neutral-900">{article.title}</h2>
                  <address className="text-sm font-bold text-neutral-900 uppercase border-y border-neutral-300 py-3 not-italic flex items-center gap-2">
                    بە قەڵەمی {article.authorName} <span className="text-neutral-300">•</span> {article.timestamp ? new Date(article.timestamp.toDate()).toLocaleDateString('ku-IQ') : 'ئێستا'}
                  </address>
                </header>

                <section className="magazine-content" style={{ fontFamily: articleFont }}>
                  <div 
                    className="prose prose-neutral prose-p:text-justify prose-blockquote:border-neutral-900 prose-blockquote:text-neutral-900 max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </section>
              </main>

              <aside className="lg:col-span-4 lg:order-first border-t-4 lg:border-t-0 lg:border-l-4 lg:border-r-0 border-neutral-900 pt-8 lg:pt-0 lg:pl-8 lg:pr-0">
                <h2 className="text-xl font-black border-b-2 border-neutral-900 pb-2 mb-6">دەربارەی نووسەر</h2>
                
                <div className="flex flex-col gap-4 mb-8">
                  <img 
                    src={authorAvatar} 
                    alt={article.authorName} 
                    className="w-full aspect-square object-cover grayscale contrast-125 border border-neutral-300"
                  />
                  <div>
                    <h4 className="text-lg font-black">{article.authorName}</h4>
                    <p className="text-sm font-bold text-neutral-500 uppercase mb-2">{authorJob}</p>
                    <p className="text-sm text-neutral-700 font-medium leading-relaxed">{authorBio}</p>
                  </div>
                </div>

                <section className="mt-8">
                  <h3 className="text-lg font-black bg-neutral-900 text-white px-3 py-1 inline-block mb-4">کردارەکان</h3>
                  <div className="flex gap-4">
                    <button onClick={() => handleCopyLink(article.id)} aria-label="Copy Link" className="p-3 rounded-none text-neutral-700 hover:text-white hover:bg-neutral-900 transition-colors bg-neutral-200 border border-neutral-300 flex items-center gap-2 font-bold text-sm">
                      <Icon icon="hugeicons:link-01" width={20} />
                      کۆپی بەستەر
                    </button>
                    <button onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: article.title,
                          url: `${window.location.origin}/articles?id=${article.id}`
                        }).catch(console.error);
                      } else {
                        handleCopyLink(article.id);
                      }
                    }} aria-label="Share" className="p-3 rounded-none text-neutral-700 hover:text-white hover:bg-neutral-900 transition-colors bg-neutral-200 border border-neutral-300 flex items-center gap-2 font-bold text-sm">
                      <Icon icon="hugeicons:share-01" width={20} />
                      بڵاوکردنەوە
                    </button>
                  </div>
                </section>
              </aside>
            </article>
          );
          })
        )}
      </div>
    </div>
  );
}
