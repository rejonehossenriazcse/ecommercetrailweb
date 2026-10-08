const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, '../src', filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    replacements.forEach(({ from, to }) => {
        content = content.replace(from, to);
    });
    
    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}

// Fix Header.tsx
replaceInFile('components/layout/Header.tsx', [
    // Top bar utility
    { from: /hover:text-white/g, to: 'hover:text-zinc-950' },
    // Logo
    { from: /text-white uppercase leading-none">\n\s*STRIDE/g, to: 'text-zinc-950 uppercase leading-none">\n                    STRIDE' },
    // Desktop Search Input
    { from: /text-white placeholder:text-zinc-500 text-xs rounded-full/g, to: 'text-zinc-950 placeholder:text-zinc-500 text-xs rounded-full' },
    // Account Dropdown Name
    { from: /text-xs font-bold text-white truncate/g, to: 'text-xs font-bold text-zinc-950 truncate' },
    // Account Dropdown title
    { from: /text-xs font-semibold text-white mb-2/g, to: 'text-xs font-semibold text-zinc-950 mb-2' },
    // Mobile Logo
    { from: /tracking-tighter text-white uppercase">\n\s*STRIDE/g, to: 'tracking-tighter text-zinc-950 uppercase">\n                  STRIDE' },
    // Mobile Search Input
    { from: /border-zinc-200 text-white placeholder:text-zinc-500/g, to: 'border-zinc-200 text-zinc-950 placeholder:text-zinc-500' },
    // Mobile Nav links (they have 'text-white' but shouldn't)
    { from: /rounded-xl text-sm font-bold text-white hover:bg-zinc-50/g, to: 'rounded-xl text-sm font-bold text-zinc-950 hover:bg-zinc-50' }
]);

// Fix page.tsx (Home page)
replaceInFile('app/page.tsx', [
    // Hero Section
    { from: /text-white leading-\[0\.9\] tracking-tighter/g, to: 'text-white leading-[0.9] tracking-tighter' }, // Keep this white as it's on a dark image
    { from: /border-2 border-white hover:bg-white hover:text-black text-white/g, to: 'border-2 border-white hover:bg-white hover:text-black text-white' }, // Keep
    // Product Grid
    { from: /text-3xl md:text-4xl font-black text-white uppercase/g, to: 'text-3xl md:text-4xl font-black text-zinc-950 uppercase' }, // "New Arrivals" heading
    { from: /text-white font-bold\}>\$\{prod\.price/g, to: 'text-zinc-950 font-bold\}>${prod.price' }, // product price
    { from: /text-white font-bold/g, to: 'text-zinc-950 font-bold' }, // general product price
    // Social Gallery
    { from: /className="bg-white py-16 md:py-24 text-white border-b border-zinc-200"/g, to: 'className="bg-white py-16 md:py-24 text-zinc-950 border-b border-zinc-200"' },
    { from: /border-zinc-600 hover:border-white text-white/g, to: 'border-zinc-300 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white text-zinc-900' }, // "Join The District" button
    // Blog Journal
    { from: /className="bg-white py-16 md:py-24 border-b border-zinc-200 text-white"/g, to: 'className="bg-white py-16 md:py-24 border-b border-zinc-200 text-zinc-950"' },
    // App Download Banner
    { from: /className="bg-gradient-to-r from-zinc-50 via-black to-zinc-50 py-12 border-b border-zinc-200 text-white"/g, to: 'className="bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-50 py-12 border-b border-zinc-200 text-zinc-950"' },
]);

// Fix ConciergeChat.tsx
replaceInFile('components/layout/ConciergeChat.tsx', [
    // The main floating button has 'text-white' when the chat is closed
    { from: /bg-zinc-50 text-white hover:bg-zinc-100/g, to: 'bg-white text-zinc-950 hover:bg-zinc-50 border border-zinc-200' },
    // The inner text
    { from: /text-\[10px\] font-black uppercase tracking-widest text-white/g, to: 'text-[10px] font-black uppercase tracking-widest text-zinc-950' },
    { from: /text-white/g, to: 'text-zinc-950' }, // brute force for the rest of ConciergeChat if it's all light mode
]);

// Fix CategoryShowcase.tsx
replaceInFile('components/home/CategoryShowcase.tsx', [
    { from: /text-white/g, to: 'text-zinc-950' }
]);

// Fix Footer.tsx
replaceInFile('components/layout/Footer.tsx', [
    { from: /text-white/g, to: 'text-zinc-950' },
    { from: /hover:text-white/g, to: 'hover:text-zinc-950' },
    { from: /border-zinc-800/g, to: 'border-zinc-200' },
    { from: /bg-zinc-950/g, to: 'bg-white' },
    { from: /bg-zinc-900/g, to: 'bg-zinc-50' }
]);

console.log('Targeted replacement complete.');
