import re

with open('src/components/Reports.tsx', 'r') as f:
    content = f.read()

# Make sure setViewProfileId is imported
content = content.replace("const { currentUser, users, departments, activities, logs } = useAppContext();", "const { currentUser, users, departments, activities, logs, setViewProfileId } = useAppContext();")

navigate_func = """
  const navigateToProfile = (userId: string) => {
    setViewProfileId(userId);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { tab: 'profiles' } }));
  };
"""

content = content.replace("const [viewMode, setViewMode] = useState<'All' | 'Mine'>('All');", "const [viewMode, setViewMode] = useState<'All' | 'Mine'>('All');\n" + navigate_func)

table_user = """
                        <td className="py-3 px-4 text-sm text-neutral-600 font-medium cursor-pointer hover:underline" onClick={() => navigateToProfile(log.userId)}>
                          {users.find(u => u.id === log.userId)?.name || 'نەناسراو'}
                        </td>
"""

content = re.sub(
    r'<td className="py-3 px-4 text-sm text-neutral-600 font-medium">\s*\{users\.find\(u => u\.id === log\.userId\)\?\.name \|\| \'نەناسراو\'\}\s*</td>',
    table_user,
    content,
    flags=re.DOTALL
)

with open('src/components/Reports.tsx', 'w') as f:
    f.write(content)

