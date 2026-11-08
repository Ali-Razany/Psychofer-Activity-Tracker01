const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const actionButtonsStart = content.indexOf('{/* Action Buttons */}');
const stackedCommentsStart = content.indexOf('{/* Stacked Psychosphere Comments */}');
const statsRowStart = content.indexOf('{/* Stats Row */}');

if (actionButtonsStart !== -1 && stackedCommentsStart !== -1 && statsRowStart !== -1) {
  const beforeAction = content.substring(0, actionButtonsStart);
  const actionButtonsCode = content.substring(actionButtonsStart, stackedCommentsStart);
  const commentsCode = content.substring(stackedCommentsStart, statsRowStart);
  const afterComments = content.substring(statsRowStart);

  const newContent = beforeAction + commentsCode + actionButtonsCode + afterComments;
  fs.writeFileSync('src/components/Dashboard.tsx', newContent);
  console.log('Successfully reordered');
} else {
  console.log('Could not find indices');
}
