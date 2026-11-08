const fs = require('fs');
let code = fs.readFileSync('src/components/About.tsx', 'utf8');

// Update imports
code = code.replace(
  "import { useAppContext } from '../store/AppContext';",
  "import { useAppContext } from '../store/AppContext';\nimport { AboutInfo } from '../types';"
);

// Add state and context
code = code.replace(
  "  const { users, departments } = useAppContext();",
  "  const { users, departments, currentUser, aboutInfo, updateAboutInfo } = useAppContext();\n  const [isEditing, setIsEditing] = useState(false);\n  const [editForm, setEditForm] = useState<Partial<AboutInfo>>({});"
);

// Add handleEdit function
const handleEditCode = `
  const handleEditClick = () => {
    setEditForm({
      projectTitle: aboutInfo?.projectTitle || 'پڕۆژەی سایکۆفێر',
      projectDesc: aboutInfo?.projectDesc || 'سایکۆفێر ناوەندێکی تایبەتە بۆ بڵاوکردنەوەی هۆشیاریی دەروونی و کۆمەڵایەتی... پلاتفۆرمەکەمان ئامانجییەتی کە ببێتە سەرچاوەیەکی متمانەپێکراو بۆ وەرگێڕان و بڵاوکردنەوەی بابەتە دەروونییەکان بە زمانی کوردی.',
      targetTitle: aboutInfo?.targetTitle || 'ئامانجمان',
      targetDesc: aboutInfo?.targetDesc || 'برەودان بە تەندروستی دەروونی و پێشکەشکردنی زانیاری دروست و زانستی بە کۆمەڵگەی کوردی لە ڕێگەی دەستەیەکی لێهاتوو و بەتواناوە.'
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      if (updateAboutInfo) {
        await updateAboutInfo(editForm);
      }
      setIsEditing(false);
    } catch(err) {
      alert('هەڵەیەک ڕوویدا لە کاتی هەڵگرتندا');
    }
  };
`;

code = code.replace(
  "  const getRoleName = (roles?: string[]) => {",
  handleEditCode + "\n  const getRoleName = (roles?: string[]) => {"
);

// Add edit button
code = code.replace(
  '<h2 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">',
  `<div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-neutral-800 flex items-center gap-2">`
);

code = code.replace(
  'دەربارەی سایکۆفێر          </h2>',
  `دەربارەی سایکۆفێر
            </h2>
            {currentUser?.roles.includes('Admin') && (
              <button 
                onClick={handleEditClick}
                className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
                title="گۆڕانکاری لە دەربارە"
              >
                <Icon icon="solar:pen-bold-duotone" width={20} />
              </button>
            )}
          </div>`
);

// Add editing form in the intro tab
const introTarget = `<div className="max-w-3xl space-y-6">              <h3 className="text-2xl font-bold text-primary">پڕۆژەی سایکۆفێر</h3>              <p className="text-neutral-600 leading-relaxed text-lg">                سایکۆفێر ناوەندێکی تایبەتە بۆ بڵاوکردنەوەی هۆشیاریی دەروونی و کۆمەڵایەتی... پلاتفۆرمەکەمان ئامانجییەتی کە ببێتە سەرچاوەیەکی متمانەپێکراو بۆ وەرگێڕان و بڵاوکردنەوەی بابەتە دەروونییەکان بە زمانی کوردی.              </p>              <div className="p-6 bg-primary/5 rounded-[20px] border border-primary/10">                <h4 className="font-bold text-primary mb-2 flex items-center gap-2">                  <Icon icon="solar:target-bold-duotone" width={24} />                  ئامانجمان                </h4>                <p className="text-neutral-700 leading-relaxed">                  برەودان بە تەندروستی دەروونی و پێشکەشکردنی زانیاری دروست و زانستی بە کۆمەڵگەی کوردی لە ڕێگەی دەستەیەکی لێهاتوو و بەتواناوە.                </p>              </div>            </div>`;

const introReplacement = `{isEditing ? (
              <div className="max-w-3xl space-y-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">سەردێڕی پڕۆژە</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-surface-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={editForm.projectTitle || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, projectTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">پێناسەی پڕۆژە</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-surface-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={editForm.projectDesc || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, projectDesc: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">سەردێڕی ئامانج</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-surface-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={editForm.targetTitle || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, targetTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-1">پێناسەی ئامانج</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-surface-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={editForm.targetDesc || ''}
                    onChange={e => setEditForm(prev => ({ ...prev, targetDesc: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveEdit} className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity">پاشەکەوتکردن</button>
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-neutral-100 text-neutral-700 font-bold rounded-xl hover:bg-neutral-200 transition-colors">پاشگەزبوونەوە</button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl space-y-6">
                <h3 className="text-2xl font-bold text-primary">{aboutInfo?.projectTitle || 'پڕۆژەی سایکۆفێر'}</h3>
                <p className="text-neutral-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {aboutInfo?.projectDesc || 'سایکۆفێر ناوەندێکی تایبەتە بۆ بڵاوکردنەوەی هۆشیاریی دەروونی و کۆمەڵایەتی... پلاتفۆرمەکەمان ئامانجییەتی کە ببێتە سەرچاوەیەکی متمانەپێکراو بۆ وەرگێڕان و بڵاوکردنەوەی بابەتە دەروونییەکان بە زمانی کوردی.'}
                </p>
                <div className="p-6 bg-primary/5 rounded-[20px] border border-primary/10">
                  <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                    <Icon icon="solar:target-bold-duotone" width={24} />
                    {aboutInfo?.targetTitle || 'ئامانجمان'}
                  </h4>
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {aboutInfo?.targetDesc || 'برەودان بە تەندروستی دەروونی و پێشکەشکردنی زانیاری دروست و زانستی بە کۆمەڵگەی کوردی لە ڕێگەی دەستەیەکی لێهاتوو و بەتواناوە.'}
                  </p>
                </div>
              </div>
            )}`;

code = code.replace(introTarget, introReplacement);

fs.writeFileSync('src/components/About.tsx', code);
console.log('patched About');
