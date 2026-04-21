const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app', 'dashboard', 'guide', 'GuideView.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// The file contains escaped backticks (\`) and escaped dollar signs (\$)
// We need to unescape them.
let newContent = content.replace(/\\`/g, '`');
newContent = newContent.replace(/\\\$/g, '$');

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed GuideView.tsx');
