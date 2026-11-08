const fs = require('fs');
let code = fs.readFileSync('src/components/DepartmentsList.tsx', 'utf8');

// 1. Add viewMode state
const statePattern = `const { updateProfile } = useAppContext();`;
code = code.replace(statePattern, `${statePattern}\n  const [viewMode, setViewMode] = useState<'grid-small' | 'list'>('grid-small');`);

// 2. Insert Toggle Buttons and fix grid
const searchPattern = `<div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 text-primary">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" width={32} />
          </div>
          <h1 className="text-[14px] md:text-4xl font-extrabold text-neutral-900 tracking-tight">دەستەکان</h1>
          <p className="text-neutral-500 font-medium text-[12px] sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            ئەو تیمانەی کە بزوێنەری کارەکانن، هەریەکەیان بە ئەرک و تایبەتمەندی خۆیانەوە.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">`;

const replacePattern = `<div className="mb-12 text-center space-y-4 relative">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 text-primary">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" width={32} />
          </div>
          <h1 className="text-[14px] md:text-4xl font-extrabold text-neutral-900 tracking-tight">دەستەکان</h1>
          <p className="text-neutral-500 font-medium text-[12px] sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            ئەو تیمانەی کە بزوێنەری کارەکانن، هەریەکەیان بە ئەرک و تایبەتمەندی خۆیانەوە.
          </p>
          
          <div className="flex justify-center mt-6">
            <div className="flex bg-surface-bg border border-surface-border rounded-[20px] p-1">
              <button
                onClick={() => setViewMode('grid-small')}
                className={\`px-4 py-2 rounded-2xl text-sm font-medium transition-all \${
                  viewMode === 'grid-small'
                    ? 'bg-white text-primary shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                }\`}
                title="شێوازی تۆڕ (Grid)"
              >
                <Icon icon="hugeicons:grid-view" width={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={\`px-4 py-2 rounded-2xl text-sm font-medium transition-all \${
                  viewMode === 'list'
                    ? 'bg-white text-primary shadow-sm border border-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-700'
                }\`}
                title="شێوازی لیست (List)"
              >
                <Icon icon="hugeicons:list-view" width={20} />
              </button>
            </div>
          </div>
        </div>

        <div className={viewMode === 'list' ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"}>`;

code = code.replace(searchPattern, replacePattern);

fs.writeFileSync('src/components/DepartmentsList.tsx', code);
