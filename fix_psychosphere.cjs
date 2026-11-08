const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// Change the tags/subtitle text size
const oldSubtitle = '<div className="flex items-center gap-1.5 text-xs text-blue-100 opacity-90">';
const newSubtitle = '<div className="flex items-center gap-1.5 text-[10px] text-blue-100 opacity-90">';
content = content.replace(oldSubtitle, newSubtitle);

// Change the comment text size
const oldCommentText = '<p className="text-white/90 text-xs md:text-sm leading-relaxed line-clamp-3 mb-auto relative z-10 whitespace-pre-wrap flex-1">';
const newCommentText = '<p className="text-white/90 text-[11px] md:text-xs leading-relaxed line-clamp-3 mb-auto relative z-10 whitespace-pre-wrap flex-1">';
content = content.replace(oldCommentText, newCommentText);

fs.writeFileSync('src/components/Dashboard.tsx', content);
