import re

with open('src/components/ArticlesEditor.tsx', 'r') as f:
    content = f.read()

# Fix the bug with isSubmitting
content = content.replace("setIsSubmitting(true);", "setIsSubmitting(false);")
content = content.replace("setIsSubmitting(false);\n    try {", "setIsSubmitting(true);\n    try {") # restore the intentional one

# The old article render
old_render = """          articles.map((article) => (
            <div key={article.id} className="bg-surface-paper p-6 rounded-[24px] border border-surface-border shadow-sm">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">{article.title}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Icon icon="hugeicons:user" width={14} />
                  {article.authorName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5" dir="rtl">
                  <Icon icon="hugeicons:time-01" width={14} />
                  {article.timestamp ? getTimeAgoKurdish(article.timestamp.toDate()) : 'کەمێک پێش ئێستا'}
                </span>
              </div>
              <div 
                className="prose prose-sm md:prose-base max-w-none prose-neutral rtl"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          ))"""

new_render = """          articles.map((article) => (
            <article key={article.id} className="max-w-2xl px-6 py-12 mx-auto space-y-12 bg-surface-paper rounded-[24px] border border-surface-border shadow-sm text-neutral-800">
              <div className="w-full mx-auto space-y-4 text-center">
                <p className="text-xs font-semibold tracking-wider uppercase text-primary">#بابەت</p>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl text-neutral-900">{article.title}</h1>
                <p className="text-sm text-neutral-500">
                  نووسەر
                  <a rel="noopener noreferrer" href="#" className="underline text-primary mx-1">
                    <span itemProp="name">{article.authorName}</span>
                  </a>
                  لە ڕێکەوتی
                  <time dateTime={article.timestamp ? article.timestamp.toDate().toISOString() : ''} className="mr-1">
                    {article.timestamp ? getTimeAgoKurdish(article.timestamp.toDate()) : 'کەمێک پێش ئێستا'}
                  </time>
                </p>
              </div>
              
              <div 
                className="prose prose-sm md:prose-base max-w-none prose-neutral rtl dark:text-gray-800 text-neutral-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
              
              <div className="pt-12 border-t border-surface-border">
                <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:space-x-reverse md:flex-row">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=random&size=100`} 
                    alt={article.authorName} 
                    className="self-center flex-shrink-0 w-24 h-24 border-2 border-surface-border rounded-full md:justify-self-start object-cover bg-neutral-100" 
                  />
                  <div className="flex flex-col text-right">
                    <h4 className="text-lg font-semibold text-neutral-900">{article.authorName}</h4>
                    <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                      نووسەر و ئەندام لە سیستەمی بەڕێوەبردن. ئەم بابەتە لە لایەن ئەم بەڕێزەوە نووسراوە و بڵاوکراوەتەوە بۆ سوودی گشتی و گەیاندنی زانیاری.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-6 space-x-4 space-x-reverse align-center">
                  <a rel="noopener noreferrer" href="#" aria-label="Copy Link" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">
                    <Icon icon="hugeicons:link-01" width={20} />
                  </a>
                  <a rel="noopener noreferrer" href="#" aria-label="Share" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">
                    <Icon icon="hugeicons:share-01" width={20} />
                  </a>
                </div>
              </div>
            </article>
          ))"""

if old_render in content:
    content = content.replace(old_render, new_render)
else:
    print("WARNING: Old render block not found")

with open('src/components/ArticlesEditor.tsx', 'w') as f:
    f.write(content)

print("Article render patched")
