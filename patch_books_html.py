import re

with open('src/components/BooksList.tsx', 'r') as f:
    content = f.read()

# Replace the internal book structure
old_render = r'''<div className="book-front">
                  {book.coverImage \? \(
                    <img src=\{book.coverImage\} alt=\{book.title\} className="w-full h-full object-cover" />
                  \) : \(
                    <DefaultCover book=\{book\} />
                  \)}
                </div>
                <div className="book-back"></div>
                <div className="book-spine-right" style=\{\{ backgroundColor: book.spineColor \}\}>
                  <span className="spine-text text-sm" style=\{\{ color: '#fff', textShadow: '0 0 2px rgba\(0,0,0,0\.5\)' \}\}>
                    \{book.spineText || `\$\{book.author\} — \$\{book.title\}`\}
                  </span>
                </div>
                <div className="book-pages-left"></div>
                <div className="book-pages-top"></div>
                <div className="book-pages-bottom"></div>'''

new_render = '''<div className="book-front">
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
                <div className="book-pages-bottom"></div>'''

content = re.sub(old_render, new_render, content)

with open('src/components/BooksList.tsx', 'w') as f:
    f.write(content)

print("Books HTML updated successfully")
