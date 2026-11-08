const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const commentReplacement = `export interface PollOption {
  id: string;
  text: string;
  votes: string[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes?: string[];
  reactions?: Record<string, string[]>;
  replies?: CommentReply[];
  poll?: {
    question: string;
    options: PollOption[];
  };
}`;

code = code.replace(/export interface Comment {[\s\S]*?replies\?: CommentReply\[\];\n\}/, commentReplacement);
fs.writeFileSync('src/types.ts', code);
