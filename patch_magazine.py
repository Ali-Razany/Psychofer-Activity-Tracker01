import re

with open('src/components/ArticlesEditor.tsx', 'r') as f:
    content = f.read()

# Fix the bug from the previous script where authorBio was replaced by itself
content = content.replace("const authorBio = author?.bio || '{authorBio}';", "const authorBio = author?.bio || 'نووسەر و ئەندام لە سیستەمی بەڕێوەبردن. ئەم بابەتە لە لایەن ئەم بەڕێزەوە نووسراوە و بڵاوکراوەتەوە بۆ سوودی گشتی و گەیاندنی زانیاری.';")

# We want to replace the return statement inside the articles.map
render_start_old = r'return \(\s*<article key=\{article\.id\} className="max-w-2xl.*?</article>\s*\);'

# Using DOTALL to match the whole return block
match = re.search(render_start_old, content, flags=re.DOTALL)
if match:
    new_render = """return (
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

                <section className="magazine-content">
                  <div 
                    className="prose prose-neutral prose-p:text-justify prose-blockquote:border-neutral-900 prose-blockquote:text-neutral-900 max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </section>
              </main>

              <aside className="lg:col-span-4 border-t-4 lg:border-t-0 lg:border-r-4 border-neutral-900 pt-8 lg:pt-0 lg:pr-8">
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
          );"""
    content = content.replace(match.group(0), new_render)
    with open('src/components/ArticlesEditor.tsx', 'w') as f:
        f.write(content)
    print("Magazine layout applied!")
else:
    print("Could not match the render block.")
