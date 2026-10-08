const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../src');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
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

    const classRegex = /className=(["'`])(?:(?=(\\?))\2.)*?\1/g;
    
    content = content.replace(classRegex, (match) => {
        let newMatch = match;
        
        if (newMatch.includes('hover:text-white')) {
            const isProtected = newMatch.includes('bg-orange') || 
                                newMatch.includes('bg-black') || 
                                newMatch.includes('bg-zinc-950') ||
                                newMatch.includes('bg-rose') ||
                                newMatch.includes('bg-emerald') ||
                                newMatch.includes('absolute');
            if (!isProtected) {
                newMatch = newMatch.replace(/\bhover:text-white\b/g, 'hover:text-zinc-900 font-bold');
            }
        }
        
        newMatch = newMatch.replace(/\bborder-zinc-750\b/g, 'border-zinc-300');
        newMatch = newMatch.replace(/\btext-orange-400\b/g, 'text-orange-600 font-bold');
        newMatch = newMatch.replace(/\btext-zinc-700\b/g, 'text-zinc-800 font-bold'); // Make text-zinc-700 bolder
        newMatch = newMatch.replace(/\btext-zinc-600\b/g, 'text-zinc-800 font-semibold'); // Make text-zinc-600 bolder
        
        return newMatch;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFilesCount++;
    }
});

console.log(`\nFinal touchup complete. Modified ${modifiedFilesCount} files.`);
