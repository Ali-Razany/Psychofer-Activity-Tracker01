const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code += `
export interface WorkflowHistoryItem {
  id: string;
  action: 'created' | 'forwarded' | 'completed';
  fromDepartmentId?: string;
  toDepartmentId?: string;
  byUserId: string;
  timestamp: string;
  note?: string;
}

export interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  currentDepartmentId: string;
  status: 'active' | 'completed';
  history: WorkflowHistoryItem[];
  createdAt: string;
}
`;

fs.writeFileSync('src/types.ts', code);
console.log('types updated');
