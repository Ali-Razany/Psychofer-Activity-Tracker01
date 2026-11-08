const fs = require('fs');

// Patch PublicComments.tsx
let pcCode = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

const pcTarget = `<div className="relative z-10 flex justify-between items-center text-[12px] sm:text-sm">
                                    <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-primary-dark font-bold' : 'text-neutral-700 group-hover:text-primary'}\`}>
                                      {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[16px] text-primary" />}
                                      {opt.text}
                                    </span>
                                    <span className="text-neutral-500 font-bold">{pct}%</span>
                                  </div>`;

const pcReplacement = `<div className="relative z-10 flex justify-between items-center text-[12px] sm:text-sm">
                                    <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-primary-dark font-bold' : 'text-neutral-700 group-hover:text-primary'}\`}>
                                      {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[16px] text-primary" />}
                                      {opt.text}
                                    </span>
                                    <span className="text-neutral-500 font-bold">{pct}%</span>
                                  </div>
                                  {opt.votes.length > 0 && (
                                    <div className="relative z-10 flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-black/5">
                                      {opt.votes.map(voterId => {
                                        const voter = users.find(u => u.id === voterId);
                                        if (!voter) return null;
                                        return (
                                          <div key={voterId} className="flex items-center gap-1 bg-white/70 px-1.5 py-0.5 rounded border border-neutral-200/60 shadow-sm" title={voter.name}>
                                            {voter.avatar ? <img src={voter.avatar} className="w-4 h-4 rounded-full object-cover"/> : <div className="w-4 h-4 bg-primary/20 text-primary rounded-full flex items-center justify-center text-[8px] font-bold">{voter.name.charAt(0)}</div>}
                                            <span className="text-[10px] text-neutral-600 truncate max-w-[60px] font-medium">{voter.name.split(' ')[0]}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}`;

pcCode = pcCode.replace(pcTarget, pcReplacement);
fs.writeFileSync('src/components/PublicComments.tsx', pcCode);

// Patch Dashboard.tsx
let dbCode = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const dbTarget = `<div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs">
                                      <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}\`}>
                                        {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[14px]" />}
                                        <span className="truncate max-w-[120px]">{opt.text}</span>
                                      </span>
                                      <span className="text-white/80 font-bold">{pct}%</span>
                                    </div>`;

const dbReplacement = `<div className="relative z-10 flex justify-between items-center text-[10px] sm:text-xs">
                                      <span className={\`font-medium flex items-center gap-1.5 \${isSelected ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}\`}>
                                        {isSelected && <Icon icon="hugeicons:tick-circle" className="text-[14px]" />}
                                        <span className="truncate max-w-[120px]">{opt.text}</span>
                                      </span>
                                      <span className="text-white/80 font-bold">{pct}%</span>
                                    </div>
                                    {opt.votes.length > 0 && (
                                      <div className="relative z-10 flex flex-wrap gap-1 mt-2 pt-1.5 border-t border-white/10">
                                        {opt.votes.map(voterId => {
                                          const voter = users.find(u => u.id === voterId);
                                          if (!voter) return null;
                                          return (
                                            <div key={voterId} className="flex items-center gap-1 bg-black/20 px-1 py-0.5 rounded text-[9px] border border-white/5" title={voter.name}>
                                              {voter.avatar ? <img src={voter.avatar} className="w-3 h-3 rounded-full object-cover"/> : <div className="w-3 h-3 bg-white/20 text-white rounded-full flex items-center justify-center text-[7px] font-bold">{voter.name.charAt(0)}</div>}
                                              <span className="text-white/80 truncate max-w-[40px] font-medium">{voter.name.split(' ')[0]}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}`;

dbCode = dbCode.replace(dbTarget, dbReplacement);
fs.writeFileSync('src/components/Dashboard.tsx', dbCode);

