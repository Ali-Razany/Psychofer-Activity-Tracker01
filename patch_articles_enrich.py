import re

with open('src/components/ArticlesEditor.tsx', 'r') as f:
    content = f.read()

# 1. Bring in users from context
old_context = "const { currentUser } = useAppContext();"
new_context = "const { currentUser, users } = useAppContext();"
content = content.replace(old_context, new_context)

# 2. Add copy link handler
import_match = re.search(r"import { getTimeAgoKurdish } from '\.\./lib/dateUtils';", content)
if import_match:
    old_imports = import_match.group(0)
    new_imports = old_imports + "\nimport { toast } from 'react-hot-toast';"
    content = content.replace(old_imports, new_imports)

copy_function = """
  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/articles?id=${id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('بەستەر لەبەرگیراوەیە');
    });
  };
"""
# insert before handleEditClick
content = content.replace("const handleEditClick =", copy_function + "\n  const handleEditClick =")

# 3. Update the article mapping to find the author user object
render_start_old = "articles.map((article) => ("
render_start_new = """articles.map((article) => {
            const author = users.find(u => u.id === article.authorId);
            const authorBio = author?.bio || 'نووسەر و ئەندام لە سیستەمی بەڕێوەبردن. ئەم بابەتە لە لایەن ئەم بەڕێزەوە نووسراوە و بڵاوکراوەتەوە بۆ سوودی گشتی و گەیاندنی زانیاری.';
            const authorAvatar = author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.authorName)}&background=random&size=100`;
            const authorJob = author?.jobTitle || 'نووسەر';
            return ("""
content = content.replace(render_start_old, render_start_new)

# 4. Update the img src to use authorAvatar and bio to use authorBio
img_old = r'<img\s*src=\{`https://ui-avatars\.com/api/\?name=\$\{encodeURIComponent\(article\.authorName\)\}&background=random&size=100`\}\s*alt=\{article\.authorName\}\s*className="self-center flex-shrink-0 w-24 h-24 border-2 border-surface-border rounded-full md:justify-self-start object-cover bg-neutral-100"\s*/>'
img_new = r'''<img 
                    src={authorAvatar} 
                    alt={article.authorName} 
                    className="self-center flex-shrink-0 w-24 h-24 border-2 border-surface-border rounded-full md:justify-self-start object-cover bg-neutral-100" 
                  />'''
content = re.sub(img_old, img_new, content)

bio_old = r'نووسەر و ئەندام لە سیستەمی بەڕێوەبردن\. ئەم بابەتە لە لایەن ئەم بەڕێزەوە نووسراوە و بڵاوکراوەتەوە بۆ سوودی گشتی و گەیاندنی زانیاری\.'
bio_new = r'{authorBio}'
content = re.sub(bio_old, bio_new, content)

# 5. Fix copy link button
link_old = r'<a rel="noopener noreferrer" href="#" aria-label="Copy Link" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">\s*<Icon icon="hugeicons:link-01" width=\{20\} />\s*</a>'
link_new = r'''<button onClick={() => handleCopyLink(article.id)} aria-label="Copy Link" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">
                    <Icon icon="hugeicons:link-01" width={20} />
                  </button>'''
content = re.sub(link_old, link_new, content)

# Remove the unused Share button or implement it with Web Share API
share_old = r'<a rel="noopener noreferrer" href="#" aria-label="Share" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">\s*<Icon icon="hugeicons:share-01" width=\{20\} />\s*</a>'
share_new = r'''<button onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        url: `${window.location.origin}/articles?id=${article.id}`
                      }).catch(console.error);
                    } else {
                      handleCopyLink(article.id);
                    }
                  }} aria-label="Share" className="p-2 rounded-md text-neutral-500 hover:text-primary transition-colors bg-surface-bg">
                    <Icon icon="hugeicons:share-01" width={20} />
                  </button>'''
content = re.sub(share_old, share_new, content)

# Close the map properly
content = content.replace("</article>\n          ))", "</article>\n          );\n          })")

with open('src/components/ArticlesEditor.tsx', 'w') as f:
    f.write(content)

print("Enrichment patched")
