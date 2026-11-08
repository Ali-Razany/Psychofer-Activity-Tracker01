const fs = require('fs');
let code = fs.readFileSync('src/store/AppContext.tsx', 'utf8');

if (!code.includes('aboutInfo:')) {
  // Add aboutInfo state type
  code = code.replace(
    '  loading: boolean;',
    '  loading: boolean;\n  aboutInfo: any;\n  updateAboutInfo: (info: any) => Promise<void>;'
  );
  
  // Add state
  code = code.replace(
    '  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);',
    '  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);\n  const [aboutInfo, setAboutInfo] = useState<any>(null);'
  );

  // Add fetch effect
  const effectCode = `
    // Fetch About Info
    const unsubscribeAbout = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        setAboutInfo(docSnap.data());
      } else {
        setAboutInfo({
          projectTitle: 'پڕۆژەی سایکۆفێر',
          projectDesc: 'سایکۆفێر ناوەندێکی تایبەتە بۆ بڵاوکردنەوەی هۆشیاریی دەروونی و کۆمەڵایەتی... پلاتفۆرمەکەمان ئامانجییەتی کە ببێتە سەرچاوەیەکی متمانەپێکراو بۆ وەرگێڕان و بڵاوکردنەوەی بابەتە دەروونییەکان بە زمانی کوردی.',
          targetTitle: 'ئامانجمان',
          targetDesc: 'برەودان بە تەندروستی دەروونی و پێشکەشکردنی زانیاری دروست و زانستی بە کۆمەڵگەی کوردی لە ڕێگەی دەستەیەکی لێهاتوو و بەتواناوە.'
        });
      }
    });
`;
  
  code = code.replace(
    '    return () => {',
    effectCode + '\n    return () => {\n      unsubscribeAbout();'
  );
  
  // Add updateAboutInfo
  const updateCode = `
  const updateAboutInfo = async (info: any) => {
    try {
      await setDoc(doc(db, 'settings', 'about'), info);
    } catch(err) {
      console.error(err);
      throw err;
    }
  };
`;
  
  code = code.replace(
    '  return (',
    updateCode + '\n  return ('
  );

  // Expose in Provider
  code = code.replace(
    '        viewProfileId, setViewProfileId',
    '        viewProfileId, setViewProfileId,\n        aboutInfo, updateAboutInfo'
  );

  fs.writeFileSync('src/store/AppContext.tsx', code);
  console.log('Patched AppContext');
}
