const fs = require('fs');

let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');
layout = layout.replace("    { id: 'instagram', label: 'پۆستەکانمان', icon: <Icon icon=\"hugeicons:instagram\" width={20} /> },\n", "");
fs.writeFileSync('src/components/Layout.tsx', layout);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { InstagramPostsList } from './components/InstagramPostsList';\n", "");
app = app.replace("      case 'instagram': return <InstagramPostsList onNavigate={(tab) => setActiveTab(tab)} />;\n", "");
fs.writeFileSync('src/App.tsx', app);
