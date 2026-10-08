const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

const replacements = [
    { regex: /\bbg-zinc-950\b/g, replacement: 'bg-white' },
    { regex: /\bbg-zinc-900\b/g, replacement: 'bg-zinc-50' },
    { regex: /\bbg-zinc-800\b/g, replacement: 'bg-zinc-100' },
    { regex: /\bbg-zinc-700\b/g, replacement: 'bg-zinc-200' },
    
    { regex: /\btext-zinc-50\b/g, replacement: 'text-zinc-950' },
    { regex: /\btext-zinc-100\b/g, replacement: 'text-zinc-900' },
    { regex: /\btext-zinc-200\b/g, replacement: 'text-zinc-800' },
    { regex: /\btext-zinc-300\b/g, replacement: 'text-zinc-700' },
    { regex: /\btext-zinc-400\b/g, replacement: 'text-zinc-600' },
    
    { regex: /\bborder-zinc-900\b/g, replacement: 'border-zinc-200' },
    { regex: /\bborder-zinc-800\b/g, replacement: 'border-zinc-200' },
    { regex: /\bborder-zinc-700\b/g, replacement: 'border-zinc-300' },
    
    { regex: /\bhover:bg-zinc-800\b/g, replacement: 'hover:bg-zinc-100' },
    { regex: /\bhover:bg-zinc-900\b/g, replacement: 'hover:bg-zinc-50' },
    { regex: /\bhover:text-zinc-100\b/g, replacement: 'hover:text-zinc-900' },
    { regex: /\bhover:text-zinc-200\b/g, replacement: 'hover:text-zinc-800' },
    { regex: /\bhover:text-zinc-300\b/g, replacement: 'hover:text-zinc-700' },
    
    { regex: /\bfrom-zinc-950\b/g, replacement: 'from-white' },
    { regex: /\bfrom-zinc-900\b/g, replacement: 'from-zinc-50' },
    { regex: /\bvia-zinc-950\b/g, replacement: 'via-white' },
    { regex: /\bvia-zinc-900\b/g, replacement: 'via-zinc-50' },
    { regex: /\bto-zinc-950\b/g, replacement: 'to-white' },
    { regex: /\bto-zinc-900\b/g, replacement: 'to-zinc-50' },
    
    { regex: /\bdivide-zinc-800\b/g, replacement: 'divide-zinc-200' },
    { regex: /\bdivide-zinc-900\b/g, replacement: 'divide-zinc-100' },
];

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir(directoryPath);
let modifiedFilesCount = 0;

files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    replacements.forEach(({ regex, replacement }) => {
        content = content.replace(regex, replacement);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFilesCount++;
        console.log(`Updated: ${file}`);
    }
});

console.log(`\nReplacement complete. Modified ${modifiedFilesCount} files.`);
