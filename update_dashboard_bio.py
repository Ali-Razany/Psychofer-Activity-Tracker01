import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

old_banner = """      {/* Welcome Banner */}
      <div className="bg-primary text-white rounded-[24px] p-8 shadow-custom relative overflow-hidden flex items-center">
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl font-bold mb-2">بەخێربێیتەوە، {currentUser.name}!</h1>
          <p className="text-primary-light text-lg">ئەمڕۆ چی دەکەیت؟ با دەست پێبکەین.</p>
        </div>
        <div className="hidden md:block relative z-10">
          <Icon icon="fluent-emoji:rocket" width={100} />
        </div>
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
      </div>"""

new_banner = """      {/* Welcome Banner */}
      <div className="bg-primary text-white rounded-[24px] p-8 shadow-custom relative overflow-hidden flex items-center">
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl font-bold mb-2">بەخێربێیتەوە، {currentUser.name}!</h1>
          <p className="text-primary-light text-lg">ئەمڕۆ چی دەکەیت؟ با دەست پێبکەین.</p>
        </div>
        <div className="hidden md:block relative z-10">
          <Icon icon="fluent-emoji:rocket" width={100} />
        </div>
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
      </div>
      
      {currentUser.bio && (
        <div className="bg-surface-paper rounded-[24px] shadow-custom border border-surface-border p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-neutral-100">
            <Icon icon="hugeicons:quote-up" width={80} />
          </div>
          <h3 className="text-lg font-bold text-neutral-800 mb-3 relative z-10">دەربارەی من</h3>
          <p className="text-neutral-600 leading-relaxed relative z-10 whitespace-pre-wrap">
            {currentUser.bio}
          </p>
        </div>
      )}"""

content = content.replace(old_banner, new_banner)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)

