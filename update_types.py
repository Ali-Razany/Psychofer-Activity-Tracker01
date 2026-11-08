import re

with open('src/types.ts', 'r') as f:
    content = f.read()

new_comment = """export interface CommentReply {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes?: string[];
  replies?: CommentReply[];
}"""

content = content.replace("export interface Comment {\n  id: string;\n  userId: string;\n  content: string;\n  timestamp: string;\n}", new_comment)

with open('src/types.ts', 'w') as f:
    f.write(content)
