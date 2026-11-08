import re

with open('src/components/ArticlesEditor.tsx', 'r') as f:
    content = f.read()

# 1. Add new state variables for edit
state_block_match = re.search(r'const \[isSubmitting, setIsSubmitting\] = useState\(false\);', content)
if state_block_match:
    old_state = state_block_match.group(0)
    new_state = old_state + """\n  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);\n  const isAdmin = (currentUser?.roles || []).includes('Admin');"""
    content = content.replace(old_state, new_state)

# 2. Add imports for doc, deleteDoc, updateDoc
content = content.replace(
    "import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';",
    "import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';"
)

# 3. Update handleSubmit to handle edit
save_method = """  const handleSubmit = async (e: React.FormEvent) => {
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
"""

content = re.sub(r'const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?^\s*};\n', save_method + '\n', content, flags=re.MULTILINE | re.DOTALL)

# Update cancel button to clear edit state
content = re.sub(
    r'onClick=\{\(\) => setIsEditing\(!isEditing\)\}',
    r'''onClick={() => { setIsEditing(!isEditing); if(isEditing) { setEditingArticleId(null); setTitle(''); setContent(''); } }}''',
    content
)

# Replace the text "بڵاوکردنەوە" dynamically
content = re.sub(
    r'بڵاوکردنەوە\s*</button>',
    r'{editingArticleId ? "نوێکردنەوە" : "بڵاوکردنەوە"}</button>',
    content
)

# 4. Add edit/delete buttons to the article render
article_header_old = r'<div className="w-full mx-auto space-y-4 text-center">'
article_header_new = r'''<div className="w-full mx-auto space-y-4 text-center relative">
                {(currentUser?.id === article.authorId || isAdmin) && (
                  <div className="absolute top-0 right-0 flex gap-2 rtl">
                    <button 
                      onClick={() => handleEditClick(article)}
                      className="p-2 text-blue-500 bg-blue-50 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                      title="دەستکاریکردن"
                    >
                      <Icon icon="hugeicons:pencil-edit-01" width={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-red-500 bg-red-50 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="سڕینەوە"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" width={18} />
                    </button>
                  </div>
                )}'''

content = content.replace(article_header_old, article_header_new)

with open('src/components/ArticlesEditor.tsx', 'w') as f:
    f.write(content)

print("Articles Editor patched with Edit/Delete")
