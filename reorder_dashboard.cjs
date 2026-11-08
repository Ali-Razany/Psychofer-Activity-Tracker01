const fs = require('fs');
const content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const actionButtonsRegex = /(\{\/\* Action Buttons \*\/\}.*?)(?=\{\/\* Stacked Psychosphere Comments \*\/\}|$)/s;
const commentsRegex = /(\{\/\* Stacked Psychosphere Comments \*\/\}.*?(?=\n\s*\{\/\* Timeline Widget \*\/\}))/s;

let newContent = content;

const commentsMatch = content.match(commentsRegex);
const actionButtonsMatch = content.match(actionButtonsRegex);

if (commentsMatch && actionButtonsMatch) {
  const commentsBlock = commentsMatch[0];
  const actionButtonsBlock = actionButtonsMatch[0];
  
  newContent = newContent.replace(commentsBlock, '');
  newContent = newContent.replace(actionButtonsBlock, commentsBlock + '\n' + actionButtonsBlock);
  fs.writeFileSync('src/components/Dashboard.tsx', newContent);
  console.log("Successfully reordered.");
} else {
  console.log("Failed to match blocks.");
}
