import re

with open('src/components/ProfilesList.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const { users, departments, logs, currentUser, awardBadge } = useAppContext();", "  const { users, departments, logs, currentUser, awardBadge, activities } = useAppContext();")

old_list = """                  <div className="space-y-3">
                    {userLogs.slice(0, 10).map(log => (
                      <div key={log.id} className="flex items-center justify-between border-b border-surface-border last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center shrink-0">
                            <Icon icon="hugeicons:activity-01" width={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">ڕێکەوت: {log.date}</p>
                            {log.notes && <p className="text-xs text-neutral-500 truncate">{log.notes}</p>}
                          </div>
                        </div>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-md shrink-0">
                          +{log.totalPoints}
                        </span>
                      </div>
                    ))}"""

new_list = """                  <div className="space-y-3">
                    {userLogs.slice(0, 10).map(log => {
                      const activityTask = activities.find(a => a.id === log.taskId);
                      return (
                      <div key={log.id} className="flex items-center justify-between border-b border-surface-border last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-surface-border flex items-center justify-center shrink-0 text-primary">
                            <Icon icon="hugeicons:task-done-01" width={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate" title={activityTask?.name}>
                              {activityTask?.name || 'چالاکی نەناسراو'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              ڕێکەوت: {log.date} {log.notes ? `• ${log.notes}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-md shrink-0">
                          +{log.totalPoints}
                        </span>
                      </div>
                    )})}"""

content = content.replace(old_list, new_list)

with open('src/components/ProfilesList.tsx', 'w') as f:
    f.write(content)
