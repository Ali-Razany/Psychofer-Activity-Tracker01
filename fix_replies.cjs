const fs = require('fs');
let content = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

const oldReplies = `<div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="بۆچوونەکەت لێرە بینووسە..."
                          className="w-full bg-surface-bg border border-surface-border rounded-[16px] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[60px] resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="bg-primary text-white p-3 rounded-[16px] hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Icon icon="fluent:send-24-filled" width={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />
                      </button>`;

const newReplies = `<div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="بۆچوونەکەت لێرە بینووسە..."
                          className="w-full bg-surface-bg border border-surface-border rounded-[12px] md:rounded-[16px] p-2 md:p-3 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[50px] md:min-h-[60px] resize-none"
                        />
                      </div>
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="bg-primary text-white p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] hover:bg-primary-dark transition-colors disabled:opacity-50 shrink-0"
                      >
                        <Icon icon="fluent:send-24-filled" className={\`text-[16px] md:text-[20px] \${document.dir === 'rtl' ? 'rotate-180' : ''}\`} />
                      </button>`;

content = content.replace(oldReplies, newReplies);

const oldReplyMap = `<div className="flex-1 bg-surface-paper p-3 rounded-[16px] rounded-tr-none border border-surface-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-neutral-800">{replyUser?.name || 'نەناسراو'}</span>
                                <span className="text-[10px] text-neutral-400" dir="ltr">{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}</span>
                              </div>
                              <p className="text-xs text-neutral-600 whitespace-pre-wrap">{reply.content}</p>
                            </div>`;

const newReplyMap = `<div className="flex-1 bg-surface-paper p-2.5 md:p-3 rounded-[12px] md:rounded-[16px] rounded-tr-none border border-surface-border">
                              <div className="flex items-center justify-between mb-0.5 md:mb-1">
                                <span className="font-bold text-[11px] md:text-xs text-neutral-800">{replyUser?.name || 'نەناسراو'}</span>
                                <span className="text-[9px] md:text-[10px] text-neutral-400" dir="ltr">{formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}</span>
                              </div>
                              <p className="text-[10px] md:text-xs text-neutral-600 whitespace-pre-wrap">{reply.content}</p>
                            </div>`;

content = content.replace(oldReplyMap, newReplyMap);

fs.writeFileSync('src/components/PublicComments.tsx', content);
