const fs = require('fs');

let content = fs.readFileSync('src/components/WorkflowTasks.tsx', 'utf8');

const oldBtn = `<button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-[12px] md:text-sm bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <Icon icon="solar:add-circle-bold" className="w-4 h-4 md:w-5 md:h-5" />
            ڕاسپاردنی ئەرک
          </button>`;

const newBtn = `<button 
            onClick={() => setShowCreateModal(true)}
            title="ڕاسپاردنی ئەرک"
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Icon icon="solar:add-circle-bold" className="w-5 h-5 md:w-6 md:h-6" />
          </button>`;

content = content.replace(oldBtn, newBtn);

fs.writeFileSync('src/components/WorkflowTasks.tsx', content);
