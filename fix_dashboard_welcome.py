import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add motion import
content = content.replace("import { formatDistanceToNow } from 'date-fns';", "import { formatDistanceToNow } from 'date-fns';\nimport { motion, AnimatePresence } from 'motion/react';")

# Increase limit and add state for dismissed
old_state = """  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🎉', '🔥'];

  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'), limit(3));"""

new_state = """  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [showReactionsFor, setShowReactionsFor] = useState<string | null>(null);
  const [dismissedComments, setDismissedComments] = useState<string[]>([]);
  const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🎉', '🔥'];

  useEffect(() => {
    const q = query(collection(db, 'public_comments'), orderBy('timestamp', 'desc'), limit(10));"""

content = content.replace(old_state, new_state)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
