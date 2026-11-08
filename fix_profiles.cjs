const fs = require('fs');
let code = fs.readFileSync('src/components/ProfilesList.tsx', 'utf8');

// First remove both getStrandColors and getGradientStyle entirely.
const toRemoveStrands = /  const getStrandColors = \([\s\S]*?\};\n/;
code = code.replace(toRemoveStrands, '');

const toRemoveGradient = /  const getGradientStyle = \([\s\S]*?\};\n/;
code = code.replace(toRemoveGradient, '');

const newHelpers = `  const getDeptColorInfo = (userDeps?: string[]) => {
    if (!userDeps || userDeps.length === 0) return { bg: 'linear-gradient(135deg, #a8c8dc 0%, #d4e5ed 100%)', strands: ['#94a3b8', '#cbd5e1', '#e2e8f0'] };
    const id = userDeps[0];
    const dept = departments.find(d => d.id === id);
    const name = dept?.name || '';
    
    if (name.includes('ڕاگەیاندن')) return { bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', strands: ['#047857', '#10b981', '#6ee7b7', '#ffffff'] }; // Green
    if (name.includes('نەخشەسازی') || name.includes('دیزاین')) return { bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', strands: ['#1d4ed8', '#3b82f6', '#93c5fd', '#ffffff'] }; // Blue
    if (name.includes('دۆبلاژ')) return { bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', strands: ['#6d28d9', '#8b5cf6', '#c4b5fd', '#ffffff'] }; // Violet
    if (name.includes('وەرگێڕان')) return { bg: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)', strands: ['#c2410c', '#f97316', '#fdba74', '#ffffff'] }; // Orange
    if (name.includes('پێداچوونەوە')) return { bg: 'linear-gradient(135deg, #db2777 0%, #f472b6 100%)', strands: ['#be185d', '#ec4899', '#fbcfe8', '#ffffff'] }; // Pink
    if (name.includes('تایپ')) return { bg: 'linear-gradient(135deg, #0d9488 0%, #2dd4bf 100%)', strands: ['#0f766e', '#14b8a6', '#5eead4', '#ffffff'] }; // Teal
    if (name.includes('ئایتی') || name.includes('IT')) return { bg: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', strands: ['#4338ca', '#6366f1', '#a5b4fc', '#ffffff'] }; // Indigo
    
    // Fallback based on custom color or default
    const c = dept?.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb'))) {
       return { bg: \`linear-gradient(135deg, \${c} 0%, \${c}80 100%)\`, strands: [c, '#ffffff'] };
    }
    
    return { bg: 'linear-gradient(135deg, #546FFF 0%, #3D53DB 100%)', strands: ['#3D53DB', '#546FFF', '#BAC8FF', '#ffffff'] };
  };

  const getGradientStyle = (userDeps?: string[]) => {
    return { background: getDeptColorInfo(userDeps).bg };
  };\n\n`;

const targetInsert = `  if (selectedUser) {`;
code = code.replace(targetInsert, newHelpers + targetInsert);

fs.writeFileSync('src/components/ProfilesList.tsx', code);
console.log('fixed profileslist helpers');
