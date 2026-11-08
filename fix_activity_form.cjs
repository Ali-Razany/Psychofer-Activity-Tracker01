const fs = require('fs');
let content = fs.readFileSync('src/components/ActivityForm.tsx', 'utf8');

const oldTextarea = `<textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />`;

const newTextarea = `<textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-surface-bg border border-surface-border rounded-[16px] md:rounded-[20px] p-3 md:p-4 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />`;

const oldButton = `<button 
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-3 rounded-[20px] flex items-center justify-center gap-2 transition-colors"
          >`;

const newButton = `<button 
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-medium py-2 md:py-3 text-[12px] md:text-base rounded-[16px] md:rounded-[20px] flex items-center justify-center gap-2 transition-colors shadow-sm"
          >`;

content = content.replace(oldTextarea, newTextarea);
content = content.replace(oldButton, newButton);

fs.writeFileSync('src/components/ActivityForm.tsx', content);
