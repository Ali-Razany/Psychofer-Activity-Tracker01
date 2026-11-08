const fs = require('fs');
let content = fs.readFileSync('src/components/PublicComments.tsx', 'utf8');

const oldHeader = `<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
            <Icon icon="fluent-emoji:speech-balloon" width={36} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">دیوەخانی گشتی</h2>
            <p className="text-white/80">لێرە دەتوانیت بە ئازادی قسەی دڵی خۆت بکەیت و لەگەڵ هاوڕێکانتدا گفتوگۆ بکەیت.</p>
          </div>
        </div>
      </div>`;

const newHeader = `<div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[20px] p-4 md:p-6 relative overflow-hidden shadow-lg text-white">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 md:w-16 md:h-16 bg-white/20 rounded-[12px] md:rounded-[20px] flex items-center justify-center backdrop-blur-md shrink-0">
            <Icon icon="fluent-emoji:speech-balloon" className="text-[24px] md:text-[36px]" />
          </div>
          <div>
            <h2 className="text-[15px] md:text-2xl font-bold mb-0.5">دیوەخانی گشتی</h2>
            <p className="text-white/80 text-[10px] md:text-base">لێرە دەتوانیت بە ئازادی قسەی دڵی خۆت بکەیت و لەگەڵ هاوڕێکانتدا گفتوگۆ بکەیت.</p>
          </div>
        </div>
      </div>`;

content = content.replace(oldHeader, newHeader);

const oldForm = `<div className="bg-surface-paper p-6 rounded-[24px] shadow-custom border border-surface-border">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="بیر لە چی دەکەیتەوە؟ لێرە بینووسە..."
            className="w-full bg-surface-bg border border-surface-border rounded-[20px] p-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px] resize-none"
            disabled={loading || !currentUser}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || loading || !currentUser}
              className="bg-primary text-white px-6 py-2.5 rounded-[20px] font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {loading ? <Icon icon="eos-icons:loading" width={20} className="animate-spin" /> : <Icon icon="fluent:send-24-filled" width={20} className={document.dir === 'rtl' ? 'rotate-180' : ''} />}
              بڵاوکردنەوە
            </button>
          </div>
        </form>
      </div>`;

const newForm = `<div className="bg-surface-paper p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-custom border border-surface-border">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="بیر لە چی دەکەیتەوە؟ لێرە بینووسە..."
            className="w-full bg-surface-bg border border-surface-border rounded-[16px] md:rounded-[20px] p-3 md:p-4 text-[10px] md:text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[80px] md:min-h-[100px] resize-none"
            disabled={loading || !currentUser}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || loading || !currentUser}
              className="bg-primary text-white px-4 py-1.5 md:px-6 md:py-2.5 text-[10px] md:text-base leading-[14px] md:leading-normal rounded-[16px] md:rounded-[20px] font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1.5 md:gap-2 shadow-sm"
            >
              {loading ? <Icon icon="eos-icons:loading" className="text-[14px] md:text-[20px] animate-spin" /> : <Icon icon="fluent:send-24-filled" className={\`text-[14px] md:text-[20px] \${document.dir === 'rtl' ? 'rotate-180' : ''}\`} />}
              بڵاوکردنەوە
            </button>
          </div>
        </form>
      </div>`;

content = content.replace(oldForm, newForm);

fs.writeFileSync('src/components/PublicComments.tsx', content);
