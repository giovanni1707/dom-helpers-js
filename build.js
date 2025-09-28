// build.js
const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

// List of your library files in order
const files = [
  'dom-helpers.js',
  'dom-helpers-animation.js',
  'dom-helpers-form.js',
  'dom-helpers-storage.js',
  'dom-helpers-async.js'
];

// Output folder (optional)
const outputFolder = __dirname;

// Utility function to read a file
const readFile = file => fs.readFileSync(path.join(__dirname, file), 'utf8');

// Minify and save a file
async function minifyFile(inputFile, outputFile) {
  const code = readFile(inputFile);
  const minified = await minify(code, {
    compress: true,
    mangle: true
  });
  fs.writeFileSync(path.join(outputFolder, outputFile), minified.code, 'utf8');
  console.log(`${outputFile} created.`);
}

// Combine files
async function build() {
  // 1. Combine all files
  let combinedCode = '';
  for (const file of files) {
    combinedCode += readFile(file) + '\n';
  }
  const combinedFile = 'dom-helpers-combined.js';
  fs.writeFileSync(path.join(outputFolder, combinedFile), combinedCode, 'utf8');
  console.log(`${combinedFile} created.`);

  // 2. Minify individual files
  for (const file of files) {
    const name = path.basename(file, '.js');
    await minifyFile(file, `${name}.min.js`);
  }

  // 3. Minify combined file
  await minifyFile(combinedFile, 'dom-helpers-combined.min.js');

  console.log('All files combined and minified successfully!');
}

// Run the build
build().catch(err => console.error(err));
