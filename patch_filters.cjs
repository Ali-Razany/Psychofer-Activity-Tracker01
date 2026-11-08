const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

// Add state
const statePattern = `const [searchTerm, setSearchTerm] = useState('');`;
code = code.replace(statePattern, `${statePattern}\n  const [filterDept, setFilterDept] = useState<string>('all');\n  const [filterRole, setFilterRole] = useState<string>('all');`);

// Update filteredUsers logic
const oldFilter = `  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (departments.find(d => d.id === (u.departments?.[0] || ""))?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );`;

const newFilter = `  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (departments.find(d => d.id === (u.departments?.[0] || ""))?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || (u.departments || []).includes(filterDept);
    const matchesRole = filterRole === 'all' || (u.roles || []).includes(filterRole as any) || (filterRole === 'Member' && (!u.roles || u.roles.length === 0));
    return matchesSearch && matchesDept && matchesRole;
  });`;

code = code.replace(oldFilter, newFilter);

// Update UI
const oldUI = `      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="flex flex-col sm:flex-row gap-4">`;

const newUI = `      <div className="bg-surface-paper p-4 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">`;

code = code.replace(oldUI, newUI);

const listBtnsEnd = `            </button>
          </div>
        </div>
      </div>`;

const listBtnsEndNew = `            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select 
            value={filterDept} 
            onChange={e => setFilterDept(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-xl px-4 py-2 text-[12px] sm:text-sm focus:outline-none focus:border-primary text-neutral-700 cursor-pointer"
          >
            <option value="all">هەموو دەستەکان</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select 
            value={filterRole} 
            onChange={e => setFilterRole(e.target.value)}
            className="bg-surface-bg border border-surface-border rounded-xl px-4 py-2 text-[12px] sm:text-sm focus:outline-none focus:border-primary text-neutral-700 cursor-pointer"
          >
            <option value="all">هەموو پلەکان</option>
            <option value="Admin">سەرپەرشتیاری گشتی</option>
            <option value="AssistantAdmin">یاریدەدەری سەرپەرشتیار</option>
            <option value="DepartmentRep">نوێنەری بەش</option>
            <option value="Supervisor">سەرپەرشتیاری دەستە</option>
            <option value="Member">ئەندام</option>
          </select>
        </div>
      </div>`;

code = code.replace(listBtnsEnd, listBtnsEndNew);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
