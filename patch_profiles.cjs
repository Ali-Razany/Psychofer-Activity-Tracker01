const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

const oldSearchBlock = `<div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="relative">
          <Icon icon="mynaui:search" width={18} />
          <input
            type="text"
            placeholder="گەڕان بەدوای ناو یان دەستە..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>`;

const newSearchBlock = `<div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Icon icon="mynaui:search" width={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="گەڕان بەدوای ناو یان دەستە..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-neutral-800"
            />
          </div>
          <div className="flex bg-surface-bg border border-surface-border rounded-[20px] p-1 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid-small')}
              className={\`px-4 py-2 rounded-2xl text-sm font-medium transition-all \${
                viewMode !== 'list'
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
      </div>`;

code = code.replace(oldSearchBlock, newSearchBlock);
fs.writeFileSync('src/components/ProfilesList.tsx', code);
