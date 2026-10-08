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

    // Process className strings
    // This regex matches className="...", className={`...`}, className={'...'}
    const classRegex = /className=(["'`])(?:(?=(\\?))\2.)*?\1/g;
    
    content = content.replace(classRegex, (match) => {
        let newMatch = match;
        
        // If it has text-white, let's see if we should replace it
        if (newMatch.includes('text-white')) {
            const isProtected = newMatch.includes('bg-orange') || 
                                newMatch.includes('bg-black') || 
                                newMatch.includes('bg-zinc-950') ||
                                newMatch.includes('bg-zinc-900') ||
                                newMatch.includes('bg-rose') ||
                                newMatch.includes('bg-emerald') ||
                                newMatch.includes('absolute') ||
                                newMatch.includes('from-black') ||
                                newMatch.includes('from-zinc-9') ||
                                newMatch.includes('bg-red');
            if (!isProtected) {
                // Change text-white to text-zinc-900 font-bold (since user asked for some bold texts)
                newMatch = newMatch.replace(/\btext-white\b/g, 'text-zinc-900 font-bold');
            }
        }
        
        // Fix other faint text colors globally within classNames
        newMatch = newMatch.replace(/\btext-zinc-500\b/g, 'text-zinc-600 font-medium');
        newMatch = newMatch.replace(/\btext-zinc-400\b/g, 'text-zinc-700 font-semibold');
        newMatch = newMatch.replace(/\btext-zinc-300\b/g, 'text-zinc-800 font-bold');
        
        // Fix borders
        newMatch = newMatch.replace(/\bborder-zinc-800\b/g, 'border-zinc-300');
        newMatch = newMatch.replace(/\bborder-zinc-700\b/g, 'border-zinc-300');
        
        // Fix faint text in uppercase labels (often text-zinc-400 or text-zinc-500)
        newMatch = newMatch.replace(/\btext-xs text-zinc-400\b/g, 'text-xs text-zinc-800 font-bold');
        
        return newMatch;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedFilesCount++;
    }
});

console.log(`\nAdvanced replacement complete. Modified ${modifiedFilesCount} files.`);
