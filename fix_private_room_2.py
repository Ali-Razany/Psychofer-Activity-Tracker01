with open('src/components/PrivateRoom.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
block = []
skip = False
for line in lines:
    if "const roomMembers =" in line or "const isSupervisor =" in line or "const isAdmin =" in line or "const canEditBlog =" in line or "const deptName =" in line:
        block.append(line)
    elif "const canSelectDept =" in line:
        new_lines.append(line)
        new_lines.extend(block)
    else:
        new_lines.append(line)

with open('src/components/PrivateRoom.tsx', 'w') as f:
    f.writelines(new_lines)
