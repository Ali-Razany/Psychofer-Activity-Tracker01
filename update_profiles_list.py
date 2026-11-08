import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

# 1. Add state for viewMode
content = content.replace("const [selectedBadge, setSelectedBadge] = useState('consistency');", "const [selectedBadge, setSelectedBadge] = useState('consistency');\n  const [viewMode, setViewMode] = useState<'grid-large' | 'grid-small' | 'list'>('grid-small');")

# 2. Update search bar container
old_search = """      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
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
      </div>"""

new_search = """      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Icon icon="mynaui:search" width={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input 
            type="text"
            placeholder="گەڕان بەدوای ناو یان دەستە..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-surface-bg p-1.5 rounded-[20px] border border-surface-border self-end sm:self-auto">
          <button 
            onClick={() => setViewMode('grid-large')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'grid-large' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="گەورە"
          >
            <Icon icon="hugeicons:grid-view" width={20} />
          </button>
          <button 
            onClick={() => setViewMode('grid-small')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'grid-small' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="بچووک"
          >
            <Icon icon="hugeicons:dashboard-square-01" width={20} />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-[16px] transition-colors flex items-center justify-center ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-neutral-500 hover:text-neutral-700'}`}
            title="لیست"
          >
            <Icon icon="hugeicons:menu-01" width={20} />
          </button>
        </div>
      </div>"""
content = content.replace(old_search, new_search)

# 3. Modify the grid and card layout based on viewMode
# We will use regex to replace the map function completely for the user list to support the 3 layouts cleanly.

old_grid_start = """      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => (
          <div """

old_grid_end = """                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-bold border border-amber-100">
                  {user.points}
                  <Icon icon="fluent-emoji:star" width={14} />
                </div>
            </div>
          </div>
        ))}
      </div>"""

# Let's write the new rendering block using a dedicated file write because it's big.
pass
