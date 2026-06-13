const { execFileSync } = require('child_process');
const { readdirSync } = require('fs');
const path = require('path');
const ejs = require('ejs');
const { readFileSync } = require('fs');

const root = path.join(__dirname, '..');
const ignored = new Set(['node_modules', '.git']);

function findJavaScriptFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        if (ignored.has(entry.name)) return [];
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findJavaScriptFiles(fullPath);
        return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
    });
}

for (const file of findJavaScriptFiles(root)) {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

const viewsDirectory = path.join(root, 'views');
function findEjsFiles(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return findEjsFiles(fullPath);
        return entry.isFile() && entry.name.endsWith('.ejs') ? [fullPath] : [];
    });
}

for (const file of findEjsFiles(viewsDirectory)) {
    ejs.compile(readFileSync(file, 'utf8'), { filename: file });
}

console.log('JavaScript and EJS syntax checks passed.');
