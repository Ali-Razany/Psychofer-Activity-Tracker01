import re

with open('src/components/BooksList.tsx', 'r') as f:
    content = f.read()

# 1. Update form fields to include spine text and thickness
spine_fields = """
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">نووسراوی سەر قەد (Spine Text)</label>
                  <input type="text" value={spineText} onChange={e => setSpineText(e.target.value)} placeholder="ئەگەر بەتاڵ بێت ناوی کتێب و نووسەر دادەنرێت" className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">ئەستووری کتێب (Thickness px)</label>
                  <input type="number" value={thickness} onChange={e => setThickness(Number(e.target.value))} required min={10} max={200} className="w-full border rounded-xl p-3 focus:outline-none focus:border-primary" />
                </div>
"""

content = re.sub(
    r'(<label className="block text-sm font-bold text-neutral-700 mb-2">ڕەنگی قەدی کتێب \(Spine\)</label>\s*<input[^>]+>\s*</div>)',
    r'\1\n' + spine_fields,
    content
)

# 2. Update submit button
content = re.sub(
    r'<button type="submit"[^>]+>\s*\{loading \? <Icon icon="fluent:spinner-ios-20-regular"[^>]+> : <Icon icon="hugeicons:plus-sign"[^>]+>\}\s*زیادکردن\s*</button>',
    r'''<button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2">
                  {loading ? <Icon icon="fluent:spinner-ios-20-regular" className="animate-spin" width={20} /> : <Icon icon={editingBookId ? "hugeicons:pencil-edit-01" : "hugeicons:plus-sign"} width={20} />}
                  {editingBookId ? 'نوێکردنەوە' : 'زیادکردن'}
                </button>''',
    content
)

# 3. Update cancel button at the top
content = re.sub(
    r'onClick=\{\(\) => setIsAdding\(!isAdding\)\}',
    r'''onClick={() => { setIsAdding(!isAdding); if(isAdding) { setEditingBookId(null); setTitle(''); setAuthor(''); setCoverImage(''); setCoverFile(null); setSpineText(''); setThickness(40); } }}''',
    content
)

# 4. Add edit button to book list and update CSS properties
book_render_old = r'<div className="book-wrapper"\s*style=\{\{ width: `\$\{book\.width\}px`, height: `\$\{book\.height\}px` \}\}\s*>'
book_render_new = r'''<div 
                className="book-wrapper" 
                style={{ width: `${book.width}px`, height: `${book.height}px`, '--thickness': `${book.thickness || 40}px` } as React.CSSProperties}
              >'''
content = re.sub(book_render_old, book_render_new, content)

edit_btn = r'''
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
'''
content = re.sub(r'\{isAdmin && \(\s*<button\s*onClick=\{\(\) => handleDelete\(book\.id\)\}[\s\S]*?</button>\s*\)\}', edit_btn, content)

# 5. Update spine text
spine_text_old = r'<span className="spine-text text-sm" style=\{\{ color: \'#fff\', textShadow: \'0 0 2px rgba\(0,0,0,0\.5\)\' \}\}>\s*\{book\.author\} — \{book\.title\}\s*</span>'
spine_text_new = r'''<span className="spine-text text-sm" style={{ color: '#fff', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>
                    {book.spineText || `${book.author} — ${book.title}`}
                  </span>'''
content = re.sub(spine_text_old, spine_text_new, content)

with open('src/components/BooksList.tsx', 'w') as f:
    f.write(content)

print("Render patched")
