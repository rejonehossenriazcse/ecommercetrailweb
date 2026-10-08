const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, '../src/components/layout/Footer.tsx');
let content = fs.readFileSync(footerPath, 'utf8');

// The footer has a dark background bg-[#0a0a0a].
// Revert text colors back to light themes.
content = content.replace(/\btext-zinc-950\b/g, 'text-white');
content = content.replace(/\btext-zinc-800 font-semibold\b/g, 'text-zinc-400');
content = content.replace(/\btext-zinc-800 font-bold\b/g, 'text-zinc-400');
content = content.replace(/\bbg-zinc-50 border border-zinc-200\b/g, 'bg-zinc-900 border border-zinc-800');
content = content.replace(/\btext-zinc-800\b/g, 'text-zinc-400');
content = content.replace(/\bborder-zinc-200\/80\b/g, 'border-zinc-800');
content = content.replace(/\bborder-zinc-200\b/g, 'border-zinc-800');
content = content.replace(/\btext-orange-600 font-bold\b/g, 'text-orange-500');

fs.writeFileSync(footerPath, content, 'utf8');
console.log('Footer fixed');
