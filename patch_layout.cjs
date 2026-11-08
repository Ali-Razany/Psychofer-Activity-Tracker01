const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Add theme state to Layout component
const statePattern = `  const [showProfileModal, setShowProfileModal] = useState(false);`;
const stateReplacement = `  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };`;
code = code.replace(statePattern, stateReplacement);

// Add mobile toggle button
const mobileHeaderButtonsPattern = `<button 
            onClick={() => setActiveTab('dashboard')}
            className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors"
          >`;
const mobileHeaderButtonsReplacement = `<button 
            onClick={toggleTheme}
            className="p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
          >
            {theme === 'dark' ? <Icon icon="hugeicons:sun-01" width={22} /> : <Icon icon="hugeicons:moon-02" width={22} />}
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors"
          >`;
code = code.replace(mobileHeaderButtonsPattern, mobileHeaderButtonsReplacement);

// Add desktop toggle button
const desktopHeaderButtonsPattern = `<button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors bg-primary-light/10"
              title="گەڕانەوە بۆ داشبۆرد"
            >`;
const desktopHeaderButtonsReplacement = `<button 
              onClick={toggleTheme}
              className="p-2 text-neutral-600 hover:bg-surface-bg rounded-[20px] transition-colors"
              title="گۆڕینی ڕەنگ"
            >
              {theme === 'dark' ? <Icon icon="hugeicons:sun-01" width={22} /> : <Icon icon="hugeicons:moon-02" width={22} />}
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-primary hover:bg-primary-light/20 rounded-[20px] transition-colors bg-primary-light/10"
              title="گەڕانەوە بۆ داشبۆرد"
            >`;
code = code.replace(desktopHeaderButtonsPattern, desktopHeaderButtonsReplacement);

fs.writeFileSync('src/components/Layout.tsx', code);
