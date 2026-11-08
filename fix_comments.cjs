const fs = require('fs');
let content = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

const oldComment = `<div key={comment.id} className="bg-surface-paper p-6 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:shadow-custom transition-shadow">
              <div className="flex items-start gap-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-12 h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-12 h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h3 className="font-bold text-neutral-800 text-sm truncate">{user?.name || 'نەناسراو'}</h3>
                    <span className="text-[11px] text-neutral-500 whitespace-nowrap" dir="ltr">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-neutral-700 text-xs md:text-sm leading-relaxed whitespace-pre-wrap mb-4">{comment.content}</p>`;

const newComment = `<div key={comment.id} className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-border hover:shadow-custom transition-shadow">
              <div className="flex items-start gap-3 md:gap-4">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border border-surface-border shrink-0" />
                ) : (
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-light text-primary-dark rounded-full flex items-center justify-center font-bold text-sm md:text-lg shrink-0 shadow-sm">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mb-1">
                    <h3 className="font-bold text-neutral-800 text-[12px] md:text-sm truncate w-full sm:w-auto">{user?.name || 'نەناسراو'}</h3>
                    <span className="text-[10px] md:text-[11px] text-neutral-500 whitespace-nowrap text-right" dir="ltr">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-neutral-700 text-[11px] md:text-sm leading-[19.5px] md:leading-relaxed whitespace-pre-wrap mb-3 md:mb-4">{comment.content}</p>`;

content = content.replace(oldComment, newComment);

fs.writeFileSync('src/components/PublicComments.tsx', content);
