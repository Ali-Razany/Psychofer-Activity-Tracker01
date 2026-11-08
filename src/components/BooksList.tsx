import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../store/AppContext';
import { Icon } from '@iconify/react';
import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

interface Book {
  id: string;
  title: string;
  author: string;
  numberUp: string;
  numberDown: string;
  coverImage?: string;
  spineColor: string;
  coverColor: string;
  spineText?: string;
  thickness?: number;
  width: number;
  height: number;
  timestamp: any;
}

export function BooksList() {
  const { currentUser } = useAppContext();
  const isAdmin = (currentUser?.roles || []).includes('Admin');
  
  const [books, setBooks] = useState<Book[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [numberUp, setNumberUp] = useState('84');
  const [numberDown, setNumberDown] = useState('1');
  const [coverImage, setCoverImage] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [spineColor, setSpineColor] = useState('#222222');
  const [coverColor, setCoverColor] = useState('#ff6b6b');
  const [spineText, setSpineText] = useState('');
  const [thickness, setThickness] = useState(40);
  
  const [sizePreset, setSizePreset] = useState('14x21');
  const [width, setWidth] = useState(210);
  const [height, setHeight] = useState(315);

  useEffect(() => {
    if (sizePreset === '14x21') {
      setWidth(210); // 14cm * 15px (1.5x scale)
      setHeight(315); // 21cm * 15px
    } else if (sizePreset === '17x24') {
      setWidth(255); // 17cm * 15px
      setHeight(360); // 24cm * 15px
    } else if (sizePreset === 'default') {
      setWidth(160);
      setHeight(240);
    }
  }, [sizePreset]);

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Book[];
      setBooks(data);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCoverImage(''); // clear URL if file selected
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setNumberUp(book.numberUp || '');
    setNumberDown(book.numberDown || '');
    setCoverImage(book.coverImage || '');
    setCoverFile(null);
    setSpineColor(book.spineColor || '#222222');
    setCoverColor(book.coverColor || '#ff6b6b');
    setSpineText(book.spineText || '');
    setThickness(book.thickness || 40);
    setWidth(book.width || 210);
    setHeight(book.height || 315);
    setSizePreset('custom');
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;
    
    setLoading(true);
    try {
      let finalCoverUrl = coverImage;
      
      // Upload file as Base64 if selected
      if (coverFile) {
        finalCoverUrl = await compressImage(coverFile);
      }
      
      const bookData = {
        title,
        author,
        numberUp,
        numberDown,
        coverImage: finalCoverUrl,
        spineColor,
        coverColor,
        spineText,
        thickness,
        width,
        height,
        timestamp: serverTimestamp()
      };

      if (editingBookId) {
        await updateDoc(doc(db, 'books', editingBookId), bookData);
      } else {
        await addDoc(collection(db, 'books'), bookData);
      }
      
      // Reset Form
      setIsAdding(false);
      setEditingBookId(null);
      setTitle('');
      setAuthor('');
      setCoverImage('');
      setCoverFile(null);
      setSpineText('');
      setThickness(40);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (window.confirm('دڵنیایت دەتەوێت ئەم بەرهەمە بسڕیتەوە؟')) {
      await deleteDoc(doc(db, 'books', id));
    }
  };

  const DefaultCover = ({ book }: { book: Book }) => (
    <div className="w-full h-full flex flex-col justify-between items-center p-4 relative" style={{ backgroundColor: book.coverColor }}>
      <p className="text-4xl font-black text-black opacity-80">{book.numberUp}</p>
      
      <div className="flex justify-center items-center gap-2 w-full my-auto">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 100" className="w-10 h-auto opacity-90 text-black fill-current">
          <path d="M72.5,60.9C69.4,53 61.9,46.6 55.7,42.4C49.6,38.2 40.4,36.8 33.7,37.1C32.1,37.1 30.7,37.5 29.7,38.2C28.9,38.8 28.6,39.4 28.6,39.9C28.6,40.8 29.5,42.6 31.3,45.4C32.1,46.8 32.5,48.3 32.6,49.8C32.7,53.6 31.6,56.7 29.2,59.1C26.9,61.4 23.5,62.6 19.3,62.8C15.2,62.9 11.6,61.6 8.5,58.7C5.5,55.9 3.9,52.4 3.8,48.2C3.6,43.1 5.9,38.4 10.6,34.3C15.3,30.1 21.6,27.9 29.6,27.6C38.3,27.3 46.4,29.8 54.1,35.1C61.7,40.4 67.9,49 72.6,60.9z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 100" className="w-10 h-auto opacity-90 text-black fill-current" style={{ transform: 'scaleX(-1)' }}>
          <path d="M72.5,60.9C69.4,53 61.9,46.6 55.7,42.4C49.6,38.2 40.4,36.8 33.7,37.1C32.1,37.1 30.7,37.5 29.7,38.2C28.9,38.8 28.6,39.4 28.6,39.9C28.6,40.8 29.5,42.6 31.3,45.4C32.1,46.8 32.5,48.3 32.6,49.8C32.7,53.6 31.6,56.7 29.2,59.1C26.9,61.4 23.5,62.6 19.3,62.8C15.2,62.9 11.6,61.6 8.5,58.7C5.5,55.9 3.9,52.4 3.8,48.2C3.6,43.1 5.9,38.4 10.6,34.3C15.3,30.1 21.6,27.9 29.6,27.6C38.3,27.3 46.4,29.8 54.1,35.1C61.7,40.4 67.9,49 72.6,60.9z"/>
        </svg>
      </div>

      <p className="text-3xl font-bold text-black opacity-80">{book.numberDown}</p>
      <p className="text-lg font-bold text-black mt-2">{book.author}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 flex items-center gap-2">
          <Icon icon="fluent-emoji:books" width={28} />
          بەرهەمە چاپکراوەکانمان
        </h2>
        {isAdmin && (
          <button
            onClick={() => { setIsAdding(!isAdding); if(isAdding) { setEditingBookId(null); setTitle(''); setAuthor(''); setCoverImage(''); setCoverFile(null); setSpineText(''); setThickness(40); } }}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
          >
            <Icon icon={isAdding ? "hugeicons:cancel-01" : "hugeicons:plus-sign"} width={18} />
            {isAdding ? 'پاشگەزبوونەوە' : 'زیادکردنی بەرهەم'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSaveBook} className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-sm space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ناوی کتێب</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">نووسەر</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">قەبارەی کتێب</label>
                  <select value={sizePreset} onChange={e => setSizePreset(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary bg-white">
                    <option value="14x21">ستاندارد (14x21 cm)</option>
                    <option value="17x24">گەورە (17x24 cm)</option>
                    <option value="default">بچووک (وەشانی گیرفان)</option>
                    <option value="custom">قەبارەی دڵخواز (Custom)</option>
                  </select>
                </div>

                {sizePreset === 'custom' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">پانی (Width px)</label>
                      <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} required min={100} max={500} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">بەرزی (Height px)</label>
                      <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} required min={150} max={600} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ڕەنگی بەرگ (بۆ دیزاینی کێشراو)</label>
                  <input type="color" value={coverColor} onChange={e => setCoverColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ڕەنگی قەدی کتێب (Spine)</label>
                  <input type="color" value={spineColor} onChange={e => setSpineColor(e.target.value)} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">نووسراوی سەر قەد (Spine Text)</label>
                  <input type="text" value={spineText} onChange={e => setSpineText(e.target.value)} placeholder="ئەگەر بەتاڵ بێت ناوی کتێب و نووسەر دادەنرێت" className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ئەستووری کتێب (Thickness px)</label>
                  <input type="number" value={thickness} onChange={e => setThickness(Number(e.target.value))} required min={10} max={200} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ژمارەی سەرەوە</label>
                  <input type="text" value={numberUp} onChange={e => setNumberUp(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ژمارەی خوارەوە</label>
                  <input type="text" value={numberDown} onChange={e => setNumberDown(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>

                <div className="md:col-span-2 space-y-4 border border-surface-border p-4 rounded-xl bg-neutral-50/50">
                  <h4 className="font-bold text-sm text-neutral-800">وێنەی بەرگ (ئارەزوومەندانە)</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2">هەڵبژاردنی وێنە لە ئامێرەکەتەوە</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="w-full border rounded-xl p-2 bg-white text-sm focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <hr className="flex-1 border-surface-border" />
                    <span className="text-xs text-neutral-400 font-bold">یان</span>
                    <hr className="flex-1 border-surface-border" />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-neutral-600 mb-2">دانانی بەستەری وێنە (URL)</label>
                    <input 
                      type="url" 
                      value={coverImage} 
                      onChange={e => {
                        setCoverImage(e.target.value);
                        setCoverFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }} 
                      placeholder="https://..." 
                      className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary bg-white text-sm" 
                      dir="ltr" 
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                  {loading ? <Icon icon="fluent:spinner-ios-20-regular" className="animate-spin" width={20} /> : <Icon icon={editingBookId ? "hugeicons:pencil-edit-01" : "hugeicons:plus-sign"} width={20} />}
                  {editingBookId ? 'نوێکردنەوە' : 'زیادکردن'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center py-10">
        {books.map(book => (
          <div key={book.id} className="relative group flex flex-col items-center">
            {isAdmin && (
              <div className="absolute -top-4 -right-4 z-50 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="bg-red-100 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white"
                  title="سڕینەوە"
                >
                  <Icon icon="solar:trash-bin-trash-bold" width={18} />
                </button>
                <button 
                  onClick={() => handleEdit(book)}
                  className="bg-blue-100 text-blue-500 p-2 rounded-full shadow-sm hover:bg-blue-500 hover:text-white"
                  title="دەستکاریکردن"
                >
                  <Icon icon="hugeicons:pencil-edit-01" width={18} />
                </button>
              </div>
            )}
            
            <div className="book-container">
              <div 
                className="book-wrapper" 
                style={{ width: `${book.width}px`, height: `${book.height}px`, '--thickness': `${book.thickness || 40}px` } as React.CSSProperties}
              >
                <div className="book-front">
                  <span className="book-ribbon"></span>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <div className="w-full h-full relative z-10">
                      <DefaultCover book={book} />
                    </div>
                  )}
                </div>
                
                <ul className="book-page-list">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>

                <div className="book-back"></div>
                <div className="book-spine-right" style={{ backgroundColor: book.spineColor }}>
                  <span className="spine-text text-sm" style={{ color: '#fff', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>
                    {book.spineText || `${book.author} — ${book.title}`}
                  </span>
                </div>
                <div className="book-pages-left"></div>
                <div className="book-pages-top"></div>
                <div className="book-pages-bottom"></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
