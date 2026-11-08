import re

with open('src/components/BooksList.tsx', 'r') as f:
    content = f.read()

# 1. Update the submit method to handle both add and edit
save_method = """
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

      import { updateDoc } from 'firebase/firestore'; // Note: updateDoc is already imported at the top

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
"""

# Replace handleAddBook
content = re.sub(r'const handleAddBook = async \(e: React\.FormEvent\) => \{[\s\S]*?^\s*};\n', save_method + '\n', content, flags=re.MULTILINE | re.DOTALL)

with open('src/components/BooksList.tsx', 'w') as f:
    f.write(content)

print("Methods patched")
