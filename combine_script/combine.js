// combine.js
const fs = require('fs');
const path = require('path');

const files = [
  'dom-helpers.js',
  'dom-helpers-animation.js',
  'dom-helpers-form.js',
  'dom-helpers-storage.js'
];

let combined = '';

files.forEach(file => {
  combined += fs.readFileSync(path.join(__dirname, file), 'utf8') + '\n';
});

fs.writeFileSync(path.join(__dirname, 'dom-helpers-combined.js'), combined);

console.log('Combined file created successfully!');
