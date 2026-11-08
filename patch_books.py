import re

with open('src/components/BooksList.tsx', 'r') as f:
    content = f.read()

# 1. Update interface
new_interface = """
interface Book {
  id: string;
  title: string;
  author: string;
  numberUp: string;
  numberDown: string;
  coverImage?: string;
  spineColor: string;
  coverColor: string;
  spineText?: string;
  thickness?: number;
  width: number;
  height: number;
  timestamp: any;
}
"""
content = re.sub(r'interface Book \{[\s\S]*?timestamp: any;\n\}', new_interface.strip(), content)

# 2. Add editing states and extra states
state_block_match = re.search(r'const \[loading, setLoading\] = useState\(false\);[\s\S]*?const \[height, setHeight\] = useState\(315\);', content)
if state_block_match:
    old_state = state_block_match.group(0)
    new_state = old_state + """
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [spineText, setSpineText] = useState('');
  const [thickness, setThickness] = useState(40);
"""
    content = content.replace(old_state, new_state)

with open('src/components/BooksList.tsx', 'w') as f:
    f.write(content)

print("States patched")
