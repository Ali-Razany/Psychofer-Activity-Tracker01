const fs = require('fs');

const css = `@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --font-sans: "Vazirmatn", sans-serif;
  
  --color-primary: var(--primary);
  --color-primary-light: var(--primary-light);
  --color-primary-dark: var(--primary-dark);
  
  --color-secondary: var(--secondary);
  --color-secondary-light: var(--secondary-light);
  
  --color-surface-bg: var(--surface-bg);
  --color-surface-paper: var(--surface-paper);
  --color-surface-border: var(--surface-border);
  
  --color-neutral-800: var(--text-main);
  --color-neutral-900: var(--text-main);
  --color-slate-700: var(--text-main);
  --color-slate-800: var(--text-main);
  --color-slate-900: var(--text-main);
  
  --color-neutral-500: var(--text-muted);
  --color-neutral-600: var(--text-muted);
  --color-slate-400: var(--text-muted);
  --color-slate-500: var(--text-muted);
  --color-slate-600: var(--text-muted);
  
  --shadow-custom: var(--shadow-custom);
}

@layer base {
  :root {
    --primary: #546FFF;
    --primary-light: #DCE4FF;
    --primary-dark: #3D53DB;
    --secondary: #3D53DB;
    --secondary-light: #BAC8FF;
    
    --surface-bg: #F5F5F7;
    --surface-paper: #FFFFFF;
    --surface-border: #EBEDF7;
    
    --text-main: #141522;
    --text-muted: #54577A;
    
    --shadow-custom: 5px 5px 20px 0px rgba(170,170,170,0.15);
  }

  .dark {
    --primary: #6B82FF;
    --primary-light: #2A3673;
    --primary-dark: #8C9EFF;
    --secondary: #8C9EFF;
    --secondary-light: #2A3673;
    
    --surface-bg: #0F1015;
    --surface-paper: #1A1C23;
    --surface-border: #2D303B;
    
    --text-main: #F3F4F6;
    --text-muted: #9CA3AF;
    
    --shadow-custom: 0 5px 20px 0px rgba(0,0,0,0.4);
    
    /* override tailwind defaults that might be hardcoded */
    --color-white: #1A1C23;
    --color-black: #F3F4F6;
    --color-neutral-50: #0F1015;
    --color-neutral-100: #1A1C23;
    --color-neutral-200: #2D303B;
    --color-neutral-300: #4B5563;
    --color-neutral-700: #D1D5DB;
    --color-neutral-800: #F3F4F6;
    --color-neutral-900: #FFFFFF;
    
    --color-slate-50: #0F1015;
    --color-slate-100: #1A1C23;
    --color-slate-200: #2D303B;
    
    --color-blue-50: #172033;
    --color-blue-100: #1e2942;
    --color-indigo-50: #172033;
    --color-indigo-100: #1e2942;
    --color-amber-50: #332717;
    --color-amber-100: #42321e;
    --color-red-50: #33171a;
    --color-red-100: #421e22;
  }
}

@layer utilities {
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}
`;

fs.writeFileSync('src/index.css', css);
